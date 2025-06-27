# payments/views.py

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

        # Create an initial transaction associated with this payment.
        Transaction.objects.create(
            payment=payment,
            amount=payment.amount,
            status='Initiated'
        )

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

