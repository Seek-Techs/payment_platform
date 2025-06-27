# payments/serializers.py

from rest_framework import serializers
from .models import Payment, Transaction
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model, to include user details in Payment/Transaction responses
    without exposing sensitive information.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserRegistrationSerializer(serializers.ModelSerializer):
        """
        Serializer for user registration.
        Handles creating new User instances with hashed passwords.
        """
        password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
        password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

        class Meta:
            model = User
            fields = ['username', 'email', 'password', 'password2']
            extra_kwargs = {'password': {'write_only': True}} # Ensure password is not readable after creation

        def validate(self, data):
            """
            Checks that both password fields match.
            """
            if data['password'] != data['password2']:
                raise serializers.ValidationError({"password": "Password fields didn't match."})
            return data

        def create(self, validated_data):
            """
            Create and return a new `User` instance, given the validated data.
            Hashes the password.
            """
            user = User.objects.create_user(
                username=validated_data['username'],
                email=validated_data.get('email', ''), # Email is optional if not required by your User model
                password=validated_data['password']
            )
            return user

class TransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Transaction model.
    """
    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'status', 'transaction_date', 'payment']
        read_only_fields = ['transaction_date', 'payment']

class PaymentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Payment model.
    Includes a nested serializer for related transactions.
    """
    user = UserSerializer(read_only=True)
    transactions = TransactionSerializer(many=True, read_only=True, source='transaction_set')

    class Meta:
        model = Payment
        fields = ['id', 'user', 'payment_method', 'amount', 'status', 'payment_date', 'transactions']
        read_only_fields = ['payment_date', 'user', 'status'] # 'user' and 'status' will be set by the view

    # No custom create method needed here unless you want to handle nested creation directly in serializer
    # The view's perform_create will handle setting 'user' and 'status'.
