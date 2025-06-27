# payments/urls.py (for the 'payments' app)

from django.urls import path
from .views import PaymentListCreateAPIView, PaymentDetailAPIView, TransactionListAPIView, api_root
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
]

urlpatterns = format_suffix_patterns(urlpatterns)