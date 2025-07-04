# payments/urls.py (for the 'payments' app)

from django.urls import path
from .views import (
    api_root,
    PaymentListCreateAPIView,
    PaymentDetailAPIView,
    TransactionListAPIView,
    PaystackVerifyPaymentAPIView # <--- IMPORT NEW VIEW
)
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    # Payments API Endpoints
    path('', api_root, name='api-root'),  # API root endpoint
    # This will list all available API endpoints
    path('payments/', PaymentListCreateAPIView.as_view(), name='payment-list-create'),
    path('payments/<int:pk>/', PaymentDetailAPIView.as_view(), name='payment-detail'),

    # Transactions API Endpoints
    path('transactions/', TransactionListAPIView.as_view(), name='transaction-list'),
    # Add a detail view for a single transaction if needed:
    # path('transactions/<int:pk>/', TransactionDetailAPIView.as_view(), name='transaction-detail'),

    path('payments/<int:pk>/verify/', PaystackVerifyPaymentAPIView.as_view(), name='paystack-verify-payment'), # <--- ADD THIS LINE

]

urlpatterns = format_suffix_patterns(urlpatterns)