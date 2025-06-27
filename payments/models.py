# payments/models.py

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model() # Get the currently active User model

class Payment(models.Model):
    """
    Represents a payment record within the system.
    Each payment is linked to a user.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=255, help_text="e.g., 'Credit Card', 'Bank Transfer', 'PayPal'")
    payment_date = models.DateTimeField(auto_now_add=True, help_text="Automatically set to the date and time of payment creation")
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Amount of the payment")
    status = models.CharField(max_length=255, help_text="e.g., 'Pending', 'Approved', 'Rejected', 'Completed'")
    # Add fields for construction context later, e.g., project_id, milestone_id, verified_progress_percentage

    class Meta:
        verbose_name = "Payment"
        verbose_name_plural = "Payments"
        ordering = ['-payment_date']

    def __str__(self):
        return f"Payment {self.id} by {self.user.username} - {self.amount}"

class Transaction(models.Model):
    """
    Represents an individual transaction associated with a payment.
    A single payment might involve multiple internal transactions (e.g., authorization, capture).
    """
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, help_text="The payment this transaction belongs to")
    transaction_date = models.DateTimeField(auto_now_add=True, help_text="Automatically set to the date and time of transaction creation")
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Amount of this specific transaction")
    status = models.CharField(max_length=255, help_text="e.g., 'Initiated', 'Processed', 'Failed', 'Refunded'")
    # Add fields like transaction_id from a payment gateway here later

    class Meta:
        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"
        ordering = ['-transaction_date']

    def __str__(self):
        return f"Transaction {self.id} for Payment {self.payment.id} - {self.status}"
