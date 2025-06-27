# payments/admin.py

from django.contrib import admin
from .models import Payment, Transaction # Import your models

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Payment model.
    Displays key fields in the list view and allows searching/filtering.
    """
    list_display = ('id', 'user', 'amount', 'payment_method', 'payment_date', 'status')
    list_filter = ('payment_method', 'status', 'payment_date')
    search_fields = ('user__username', 'user__email', 'id')
    raw_id_fields = ('user',)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Transaction model.
    """
    list_display = ('id', 'payment', 'amount', 'transaction_date', 'status')
    list_filter = ('status', 'transaction_date')
    search_fields = ('payment__id', 'id')
    raw_id_fields = ('payment',)
