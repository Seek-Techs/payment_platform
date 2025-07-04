// frontend-new/src/pages/MyPaymentsPage.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// This component displays a comprehensive list of all payments for the authenticated user.
const MyPaymentsPage = () => {
  // <--- CHANGE: Removed 'logout' from destructuring as it's not used here directly
  const { token, isLoading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock function to simulate fetching data
  const fetchPaymentsData = async (token) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (token) {
          resolve([
            { id: 1, amount: 5000.00, method: 'Credit Card', status: 'Completed', date: '2025-06-20', paystackRef: 'PS_REF_12345' },
            { id: 2, amount: 7500.50, method: 'Bank Transfer', status: 'Pending', date: '2025-06-25', paystackRef: 'PS_REF_67890' },
            { id: 3, amount: 2500.00, method: 'Mobile Money', status: 'Failed', date: '2025-06-28', paystackRef: 'PS_REF_11223' },
            { id: 4, amount: 12000.00, method: 'Credit Card', status: 'Completed', date: '2025-06-15', paystackRef: 'PS_REF_44556' },
            { id: 5, amount: 900.75, method: 'Debit Card', status: 'Completed', date: '2025-06-10', paystackRef: 'PS_REF_77889' },
          ]);
        } else {
          reject(new Error("Authentication token missing. Cannot fetch payments."));
        }
      }, 1000);
    });
  };

  useEffect(() => {
    if (!authLoading && token) {
      setDataLoading(true);
      setError(null);
      fetchPaymentsData(token)
        .then(data => {
          setPayments(data);
        })
        .catch(err => {
          console.error("Failed to fetch payments data:", err);
          setError("Failed to load payments. Please try again.");
        })
        .finally(() => {
          setDataLoading(false);
        });
    } else if (!authLoading && !token) {
      setPayments([]);
      setDataLoading(false);
    }
  }, [token, authLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-indigo-900 text-white p-6 font-inter">
      <Navbar />

      <div className="max-w-7xl mx-auto space-y-8">
        {dataLoading ? (
          <div className="flex items-center justify-center p-8 bg-white bg-opacity-10 rounded-xl shadow-inner">
            <p className="text-xl font-semibold text-gray-200">Loading payments data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {payments.length > 0 ? (
              <div className="bg-white bg-opacity-15 p-6 rounded-xl shadow-lg overflow-x-auto">
                <table className="min-w-full bg-white bg-opacity-20 rounded-lg overflow-hidden">
                  <thead className="bg-white bg-opacity-30">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-lg text-gray-100">Payment ID</th>
                      <th className="py-3 px-4 text-left font-semibold text-lg text-gray-100">Amount</th>
                      <th className="py-3 px-4 text-left font-semibold text-lg text-gray-100">Method</th>
                      <th className="py-3 px-4 text-left font-semibold text-lg text-gray-100">Status</th>
                      <th className="py-3 px-4 text-left font-semibold text-lg text-gray-100">Date</th>
                      <th className="py-3 px-4 text-left font-semibold text-lg text-gray-100">Paystack Ref</th>
                      <th className="py-3 px-4 text-left font-semibold text-lg text-gray-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => (
                      <tr key={payment.id} className="border-t border-gray-700 hover:bg-white hover:bg-opacity-10 transition duration-150">
                        <td className="py-3 px-4 text-lg">{payment.id}</td>
                        <td className="py-3 px-4 text-lg">${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="py-3 px-4 text-lg">{payment.method}</td>
                        <td className={`py-3 px-4 text-lg font-semibold ${
                          payment.status === 'Completed' ? 'text-green-300' :
                          payment.status === 'Pending' ? 'text-yellow-300' : 'text-red-300'
                        }`}>
                          {payment.status}
                        </td>
                        <td className="py-3 px-4 text-lg">{payment.date}</td>
                        <td className="py-3 px-4 text-lg font-mono text-sm">{payment.paystackRef}</td>
                        <td className="py-3 px-4 text-lg">
                          <button
                            onClick={() => navigate(`/payments/${payment.id}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg text-sm shadow-md transition duration-300"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-xl text-gray-300 py-4">No payments found. Initiate a new payment from the Dashboard!</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyPaymentsPage;
