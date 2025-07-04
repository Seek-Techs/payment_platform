# payments/views.py
import requests # <--- ADD THIS IMPORT
from django.conf import settings # <--- ADD THIS IMPORT to access PAYSTACK_SECRET_KEY
import json # <--- ADD THIS IMPORT for handling JSON responses

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView # Can keep if needed for very custom logic later
from rest_framework.permissions import IsAuthenticated, AllowAny # AllowAny for registration
from django.shortcuts import get_object_or_404
from rest_framework.reverse import reverse
from rest_framework.decorators import api_view # Import for function-based views

from .models import Payment, Transaction
from .serializers import PaymentSerializer, TransactionSerializer, UserSerializer, UserRegistrationSerializer
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token # Import Token model for manual token creation if needed



# --- New API Root View ---
@api_view(['GET']) # Decorator to make a function-based view work with DRF
def api_root(request, format=None):
    """
    The root of the API, providing a list of available endpoints.
    """
    return Response({
        'payments': reverse('payment-list-create', request=request, format=format),
        'transactions': reverse('transaction-list', request=request, format=format),
        # Add more API endpoints here as you build them
    })

class UserRegistrationAPIView(generics.CreateAPIView):
        """
        API view for user registration.
        - POST: Create a new user account.
        """
        serializer_class = UserRegistrationSerializer
        permission_classes = [AllowAny] # Allow unauthenticated users to register

        def create(self, request, *args, **kwargs):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            
            # Optional: Automatically create a token for the new user upon registration
            user = serializer.instance
            token, created = Token.objects.get_or_create(user=user)

            return Response({
                "user": serializer.data,
                "token": token.key # Return the token to the newly registered user
            }, status=status.HTTP_201_CREATED, headers=headers)


# --- End New API Root View ---

class PaymentListCreateAPIView(generics.ListCreateAPIView):
    """
    API view to list all payments for the authenticated user or create a new payment.
    - GET: List payments (filtered by user)
    - POST: Create a new payment (user and initial status set automatically)
    """
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated] # Requires authentication

    def get_queryset(self):
        """
        Return payments for the current authenticated user only.
        """
        return Payment.objects.filter(user=self.request.user).order_by('-payment_date')

    def perform_create(self, serializer):
        """
        Assign the logged-in user and an initial 'Pending' status to the new payment.
        Also creates a dummy initial transaction for this payment.
        """
        # The user field is read_only in the serializer, so we set it here.
        # Initial status is also set by the backend.
        payment = serializer.save(user=self.request.user, status='Pending')

        # --- NEW: Initialize Paystack Transaction ---
        try:
            # Paystack amounts are in Kobo (Nigeria) or cents (USD).
            # Convert decimal amount to integer (e.g., NGN 100.00 -> 10000 kobo)
            paystack_amount_kobo = int(payment.amount * 100) 
            
            # Prepare Paystack API request headers
            headers = {
                "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
                "Content-Type": "application/json"
            }
            
            # Prepare Paystack API request payload
            payload = {
                "email": payment.user.email if payment.user.email else "customer@example.com", # Paystack requires an email
                "amount": paystack_amount_kobo, # Amount in kobo/cents
                "callback_url": f"http://127.0.0.1:8000/api/payments/{payment.id}/verify/", # Frontend will redirect here after payment
                "metadata": {
                    "payment_id": payment.id,
                    "user_id": payment.user.id,
                    "cancel_action": f"http://127.0.0.1:8000/api/payments/{payment.id}/cancel/" # Example cancel URL
                }
            }

            # Make the API call to Paystack to initialize the transaction
            response = requests.post("https://api.paystack.co/transaction/initialize",
                                     headers=headers, data=json.dumps(payload))
            response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)

            paystack_response = response.json()

            if paystack_response['status'] and paystack_response['data']['authorization_url']:
                payment.paystack_reference = paystack_response['data']['reference']
                payment.paystack_authorization_url = paystack_response['data']['authorization_url']
                payment.save()

                # Also create an initial Transaction for the payment
                Transaction.objects.create(
                    payment=payment,
                    amount=payment.amount,
                    status='Initiated',
                    paystack_charge_id=payment.paystack_reference # Use Paystack reference for initial transaction
                )
            else:
                payment.status = 'Failed'
                payment.save()
                return Response({'error': paystack_response.get('message', 'Paystack initialization failed')},
                                status=status.HTTP_400_BAD_REQUEST)

        except requests.exceptions.RequestException as e:
            # Handle network or HTTP errors from requests library
            payment.status = 'Failed'
            payment.save()
            return Response({'error': f"Network or Paystack API error: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            # Handle other unexpected errors
            payment.status = 'Failed'
            payment.save()
            return Response({'error': 'An unexpected error occurred: ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PaystackVerifyPaymentAPIView(APIView):
    """
    API view to verify a Paystack payment after the user completes it.
    This will be the callback URL for Paystack.
    """
    permission_classes = [AllowAny] # Paystack redirects here, so it needs to be accessible

    def get(self, request, pk, *args, **kwargs):
        # The 'reference' query parameter is what Paystack sends back
        paystack_reference = request.query_params.get('trxref')
        
        if not paystack_reference:
            return Response({'error': 'No transaction reference provided.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Optionally, get the payment ID from the URL if needed (pk parameter)
        payment = get_object_or_404(Payment, pk=pk)
        
        # Verify transaction with Paystack
        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        try:
            response = requests.get(f"https://api.paystack.co/transaction/verify/{paystack_reference}",
                                    headers=headers)
            response.raise_for_status()
            paystack_response = response.json()

            if paystack_response['status'] and paystack_response['data']['status'] == 'success':
                # Update payment status
                payment.status = 'Completed'
                payment.save()

                # Update or create a transaction record for the successful payment
                # Find the initiated transaction or create a new one
                transaction, created = Transaction.objects.get_or_create(
                    payment=payment,
                    paystack_charge_id=paystack_reference,
                    defaults={
                        'amount': payment.amount,
                        'status': 'Completed'
                    }
                )
                if not created:
                    transaction.status = 'Completed'
                    transaction.amount = payment.amount # Ensure amount is consistent
                    transaction.save()

                return Response({'message': 'Payment verified successfully!', 'payment_status': 'completed'}, status=status.HTTP_200_OK)
            else:
                # Payment not successful or verification failed
                payment.status = 'Failed'
                payment.save()
                # return Response({'error': 'Payment verification failed.', 'details': paystack_response.get('message')}, status=status.400_BAD_REQUEST)
                return Response({'error': 'Payment verification failed.', 'details': paystack_response.get('message')}, status=status.HTTP_400_BAD_REQUEST)

        except requests.exceptions.RequestException as e:
            # Handle network or HTTP errors
            payment.status = 'Failed' # Update payment status to reflect error
            payment.save()
            return Response({'error': f"Network or Paystack API error during verification: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            # Handle other unexpected errors
            payment.status = 'Failed'
            payment.save()
            return Response({'error': 'An unexpected error occurred during verification: ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PaymentDetailAPIView(generics.RetrieveAPIView):
    """
    API view to retrieve details of a single payment.
    - GET: Retrieve a specific payment by its primary key (pk).
    Only accessible by the owner of the payment.
    """
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    # We use a base queryset here; get_object will apply user filtering.
    queryset = Payment.objects.all()
    lookup_field = 'pk' # Specifies the URL parameter to use for lookup

    def get_object(self):
        """
        Ensures the retrieved payment belongs to the authenticated user.
        """
        # Filter the base queryset by both primary key and the requesting user.
        obj = get_object_or_404(
            self.get_queryset(),
            pk=self.kwargs['pk'],
            user=self.request.user
        )
        # You can also add check_object_permissions(self.request, obj) here if you
        # implement more granular object-level permissions (e.g., using Django Guardian).
        return obj

class TransactionListAPIView(generics.ListAPIView):
    """
    API view to list all transactions for the authenticated user's payments.
    - GET: List transactions (filtered by user's payments)
    """
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Return transactions associated with payments owned by the current authenticated user.
        """
        return Transaction.objects.filter(payment__user=self.request.user).order_by('-transaction_date')

