// frontend-new/src/pages/PaymentDetailPage.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// This component displays the detailed information for a specific payment.
const PaymentDetailPage = () => {
  // <--- CHANGE: Removed 'logout' from destructuring as it's not used here directly
  const { token, isLoading: authLoading } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const paymentId = parseInt(id);

  const [paymentDetails, setPaymentDetails] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock function to simulate fetching data
  const fetchPaymentDetails = async (token, paymentId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (token) {
          const mockPayment = {
            id: paymentId,
            amount: 7500.50,
            method: 'Bank Transfer',
            status: 'Pending',
            date: '2025-06-25',
            description: `Payment for Phase 2 construction of project #${paymentId}.`,
            paystack_reference: 'PS_REF_67890_DETAIL',
            currency: 'NGN',
            transactions: [
              { id: 201, type: 'Initiated', amount: 7500.50, date: '2025-06-25 10:00', status: 'Success' },
            ],
            project: { id: 501, name: 'Grand Mall Expansion' },
            user: { id: 1, username: 'john.doe' }
          };

          if (paymentId === 1) {
            mockPayment.amount = 5000.00;
            mockPayment.status = 'Completed';
            mockPayment.date = '2025-06-20';
            mockPayment.description = 'Final payment for office building renovation.';
            mockPayment.paystack_reference = 'PS_REF_12345_DETAIL';
            mockPayment.transactions = [
              { id: 101, type: 'Initiated', amount: 5000.00, date: '2025-06-20 09:30', status: 'Success' },
              { id: 102, type: 'Verification', amount: 5000.00, date: '2025-06-20 09:35', status: 'Success', charge_id: 'CHG_ABC456' },
            ];
          } else if (paymentId === 3) {
            mockPayment.amount = 2500.00;
            mockPayment.status = 'Failed';
            mockPayment.date = '2025-06-28';
            mockPayment.description = 'Initial deposit for warehouse construction.';
            mockPayment.paystack_reference = 'PS_REF_11223_DETAIL';
            mockPayment.transactions = [
              { id: 301, type: 'Initiated', amount: 2500.00, date: '2025-06-28 14:00', status: 'Failed' },
            ];
          }

          resolve(mockPayment);
        } else {
          reject(new Error("Authentication token missing. Cannot fetch payment details."));
        }
      }, 1000);
    });
  };

  useEffect(() => {
    if (!authLoading && token && !isNaN(paymentId)) {
      setDataLoading(true);
      setError(null);

      fetchPaymentDetails(token, paymentId)
        .then(data => {
          setPaymentDetails(data);
        })
        .catch(err => {
          console.error("Failed to fetch payment details:", err);
          setError("Failed to load payment details. Please try again.");
        })
        .finally(() => {
          setDataLoading(false);
        });
    } else if (!authLoading && !token) {
      setPaymentDetails(null);
      setDataLoading(false);
    } else if (!isNaN(paymentId) === false) {
        setError("Invalid Payment ID provided.");
        setDataLoading(false);
    }
  }, [token, authLoading, paymentId]);

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-6">
        <p className="text-xl font-semibold text-gray-200">Loading payment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-6">
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <button
            onClick={() => navigate('/payments')}
            className="mt-4 bg-white text-red-600 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
          >
            Back to Payments
          </button>
        </div>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-6">
        <p className="text-xl font-semibold text-gray-200">Payment not found.</p>
        <button
            onClick={() => navigate('/payments')}
            className="mt-4 ml-4 bg-white text-blue-600 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
          >
            Back to Payments
          </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-6 font-inter">
      <Navbar />

      <div className="max-w-4xl mx-auto space-y-6 bg-white bg-opacity-15 p-8 rounded-xl shadow-lg">
        <h2 className="text-4xl font-extrabold text-center mb-6">Payment #{paymentDetails.id}</h2>

        {/* Payment Summary Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <div className="p-4 bg-white bg-opacity-10 rounded-lg shadow-inner">
            <p className="font-semibold text-gray-300">Amount:</p>
            <p className="text-2xl font-bold text-green-300">${paymentDetails.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {paymentDetails.currency}</p>
          </div>
          <div className="p-4 bg-white bg-opacity-10 rounded-lg shadow-inner">
            <p className="font-semibold text-gray-300">Status:</p>
            <p className={`text-2xl font-bold ${
              paymentDetails.status === 'Completed' ? 'text-green-300' :
              paymentDetails.status === 'Pending' ? 'text-yellow-300' : 'text-red-300'
            }`}>
              {paymentDetails.status}
            </p>
          </div>
          <div className="p-4 bg-white bg-opacity-10 rounded-lg shadow-inner">
            <p className="font-semibold text-gray-300">Method:</p>
            <p className="text-xl">{paymentDetails.method}</p>
          </div>
          <div className="p-4 bg-white bg-opacity-10 rounded-lg shadow-inner">
            <p className="font-semibold text-gray-300">Date:</p>
            <p className="text-xl">{paymentDetails.date}</p>
          </div>
          <div className="p-4 bg-white bg-opacity-10 rounded-lg shadow-inner col-span-2">
            <p className="font-semibold text-gray-300">Description:</p>
            <p className="text-xl">{paymentDetails.description}</p>
          </div>
          <div className="p-4 bg-white bg-opacity-10 rounded-lg shadow-inner col-span-2">
            <p className="font-semibold text-gray-300">Paystack Reference:</p>
            <p className="text-xl font-mono break-all">{paymentDetails.paystack_reference || 'N/A'}</p>
          </div>
        </div>

        {/* Initiate Payment Button (Conditional) */}
        {paymentDetails.status === 'Pending' && (
          <div className="text-center mt-6">
            <button
              onClick={() => alert(`Initiating payment for ID: ${paymentDetails.id}. Redirecting to Paystack...`)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-xl"
            >
              Complete Payment via Paystack
            </button>
          </div>
        )}

        {/* Transactions Section */}
        <div className="mt-8">
          <h3 className="text-3xl font-bold mb-4 text-center">Transactions</h3>
          {paymentDetails.transactions && paymentDetails.transactions.length > 0 ? (
            <div className="overflow-x-auto bg-white bg-opacity-10 rounded-lg shadow-inner">
              <table className="min-w-full text-white">
                <thead className="bg-white bg-opacity-20">
                  <tr>
                    <th className="py-2 px-4 text-left font-semibold text-lg text-gray-100">Txn ID</th>
                    <th className="py-2 px-4 text-left font-semibold text-lg text-gray-100">Type</th>
                    <th className="py-2 px-4 text-left font-semibold text-lg text-gray-100">Amount</th>
                    <th className="py-2 px-4 text-left font-semibold text-lg text-gray-100">Date</th>
                    <th className="py-2 px-4 text-left font-semibold text-lg text-gray-100">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentDetails.transactions.map(txn => (
                    <tr key={txn.id} className="border-t border-gray-700 hover:bg-white hover:bg-opacity-5 transition duration-150">
                      <td className="py-2 px-4 text-lg">{txn.id}</td>
                      <td className="py-2 px-4 text-lg">{txn.type}</td>
                      <td className="py-2 px-4 text-lg">${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="py-2 px-4 text-lg">{txn.date}</td>
                      <td className={`py-2 px-4 text-lg font-semibold ${
                        txn.status === 'Success' ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {txn.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-lg text-gray-300 py-4">No transactions found for this payment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailPage;
