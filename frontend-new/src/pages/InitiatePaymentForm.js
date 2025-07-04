// frontend-new/src/pages/InitiatePaymentForm.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// This component provides a form for initiating a new payment request.
// It will simulate interaction with the Django backend and redirection to Paystack.

// A mock function to simulate initiating a payment with the Django backend API.
const initiatePaymentAPI = async (token, amount, paymentMethod) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token) {
        const mockResponse = {
          id: Math.floor(Math.random() * 1000) + 100,
          amount: parseFloat(amount),
          method: paymentMethod,
          status: 'Pending',
          date: new Date().toISOString().split('T')[0],
          paystack_authorization_url: 'https://paystack.com/pay/mock_auth_url_' + Math.random().toString(36).substring(7),
          message: 'Payment initiation successful. Redirecting to Paystack...',
        };
        resolve(mockResponse);
      } else {
        reject(new Error("Authentication token missing. Cannot initiate payment."));
      }
    }, 1500);
  });
};

const InitiatePaymentForm = () => { // <--- CHANGE: Removed props (onPaymentInitiated, onBackToDashboard) as they are not used directly
  // <--- CHANGE: Removed 'logout' from destructuring as it's not used directly here
  const { token, isLoading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate(); // <--- NEW: Initialize useNavigate hook

  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // If not authenticated, display access denied (should be handled by router later)
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-orange-600 p-4 text-white">
        <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
        <p className="text-lg mb-6">Please log in to initiate payments.</p>
        <button
          onClick={() => navigate('/login')} // <--- CHANGE: Use navigate for redirection
          className="bg-white text-red-600 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await initiatePaymentAPI(token, amount, paymentMethod);

      setSuccessMessage(result.message);
      alert(`Redirecting to Paystack: ${result.paystack_authorization_url}`); // Still using alert for now
      window.location.href = result.paystack_authorization_url;

      // In a real app, after Paystack redirect, user comes back to a verification page
      // For now, we'll just go back to dashboard or payments list
      navigate('/dashboard'); // <--- CHANGE: Use navigate for redirection after success
    } catch (err) {
      console.error("Payment initiation failed:", err);
      setError(err.message || "Failed to initiate payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 to-cyan-900 text-white p-6 font-inter">
      <Navbar />

      <div className="max-w-xl mx-auto bg-white bg-opacity-15 p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-4xl font-extrabold text-center mb-6">New Payment Request</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-group">
            <label htmlFor="amount" className="block text-xl font-semibold text-gray-200 mb-2 text-left">
              Amount (NGN)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="e.g., 15000.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-gray-900"
              disabled={isSubmitting}
              required
              step="0.01"
              min="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="paymentMethod" className="block text-xl font-semibold text-gray-200 mb-2 text-left">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-gray-900"
              disabled={isSubmitting}
              required
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Mobile Money">Mobile Money</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Initiating Payment...' : 'Initiate Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InitiatePaymentForm;
