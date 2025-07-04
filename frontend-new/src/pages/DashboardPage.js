// frontend-new/src/pages/DashboardPage.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// This component represents the user's main dashboard.
const DashboardPage = () => {
  // <--- CHANGE: Removed 'user' and 'logout' from destructuring as they are not used directly here
  const { token, isLoading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    recentPayments: [],
    uploadedImages: [],
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock function to simulate fetching data
  const fetchDashboardData = async (token) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (token) {
          resolve({
            recentPayments: [
              { id: 1, amount: 5000, status: 'Completed', date: '2025-06-20' },
              { id: 2, amount: 7500, status: 'Pending', date: '2025-06-25' },
              { id: 3, amount: 2500, status: 'Failed', date: '2025-06-28' },
            ],
            uploadedImages: [
              { id: 101, name: 'Site_A_Day1.jpg', status: 'Completed', progress: '85%', upload_date: '2025-06-18' },
              { id: 102, name: 'Foundation_View.png', status: 'Processing', progress: 'N/A', upload_date: '2025-06-22' },
              { id: 103, name: 'Roof_Progress.jpeg', status: 'Completed', progress: '90%', upload_date: '2025-06-25' },
            ],
          });
        } else {
          reject(new Error("Authentication token missing. Cannot fetch dashboard data."));
        }
      }, 1500);
    });
  };

  useEffect(() => {
    if (!authLoading && token) {
      setDataLoading(true);
      setError(null);
      fetchDashboardData(token)
        .then(data => {
          setDashboardData(data);
        })
        .catch(err => {
          console.error("Failed to fetch dashboard data:", err);
          setError("Failed to load dashboard data. Please try again.");
        })
        .finally(() => {
          setDataLoading(false);
        });
    } else if (!authLoading && !token) {
      setDashboardData({ recentPayments: [], uploadedImages: [] });
      setDataLoading(false);
    }
  }, [token, authLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 text-white p-6 font-inter">
      <Navbar />

      <div className="max-w-6xl mx-auto space-y-8">
        {dataLoading ? (
          <div className="flex items-center justify-center p-8 bg-white bg-opacity-10 rounded-xl shadow-inner">
            <p className="text-xl font-semibold text-gray-200">Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Quick Links Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white bg-opacity-15 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transform hover:scale-105 transition duration-300 cursor-pointer">
                <svg className="w-16 h-16 text-blue-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <h2 className="text-2xl font-semibold mb-2">Initiate New Payment</h2>
                <p className="text-gray-300">Start a new payment request for your construction projects.</p>
                <button
                  onClick={() => navigate('/initiate-payment')}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-lg shadow-md transition duration-300"
                >
                  Go to Form
                </button>
              </div>

              <div className="bg-white bg-opacity-15 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transform hover:scale-105 transition duration-300 cursor-pointer">
                <svg className="w-16 h-16 text-green-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <h2 className="text-2xl font-semibold mb-2">Upload Construction Image</h2>
                <p className="text-gray-300">Upload images for AI-powered progress verification.</p>
                <button
                  onClick={() => navigate('/upload-image')}
                  className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-5 rounded-lg shadow-md transition duration-300"
                >
                  Upload Image
                </button>
              </div>
            </div>

            {/* Recent Payments Section */}
            <div className="bg-white bg-opacity-15 p-6 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold mb-6 text-center">Recent Payments</h2>
              {dashboardData.recentPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white bg-opacity-20 rounded-lg overflow-hidden">
                    <thead className="bg-white bg-opacity-30">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold text-lg text-gray-100">ID</th>
                        <th className="py-3 px-4 text-left font-semibold text-lg text-gray-100">Amount</th>
                        <th className="py-3 px-4 text-left font-semibold text-lg text-gray-100">Status</th>
                        <th className="py-3 px-4 text-left font-semibold text-lg text-gray-100">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentPayments.map(payment => (
                        <tr key={payment.id} className="border-t border-gray-700 hover:bg-white hover:bg-opacity-10 transition duration-150">
                          <td className="py-3 px-4 text-lg">{payment.id}</td>
                          <td className="py-3 px-4 text-lg">${payment.amount.toLocaleString()}</td>
                          <td className={`py-3 px-4 text-lg font-semibold ${
                            payment.status === 'Completed' ? 'text-green-300' :
                            payment.status === 'Pending' ? 'text-yellow-300' : 'text-red-300'
                          }`}>
                            {payment.status}
                          </td>
                          <td className="py-3 px-4 text-lg">{payment.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-xl text-gray-300 py-4">No recent payments found.</p>
              )}
              <div className="text-center mt-6">
                <button
                  onClick={() => navigate('/payments')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-lg shadow-md transition duration-300"
                >
                  View All Payments
                </button>
              </div>
            </div>

            {/* Uploaded Images Section */}
            <div className="bg-white bg-opacity-15 p-6 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold mb-6 text-center">Uploaded Images Summary</h2>
              {dashboardData.uploadedImages.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white bg-opacity-20 rounded-lg overflow-hidden">
                    <thead className="bg-white bg-opacity-30">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold text-lg text-gray-100">ID</th>
                        <th className="py-3 px-4 text-left font-semibold text-lg text-gray-100">File Name</th>
                        <th className="py-3 px-4 text-left font-semibold text-lg text-gray-100">Status</th>
                        <th className="py-3 px-4 text-left font-semibold text-lg text-gray-100">Progress</th>
                        <th className="py-3 px-4 text-left font-semibold text-lg text-gray-100">Upload Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.uploadedImages.map(image => (
                        <tr key={image.id} className="border-t border-gray-700 hover:bg-white hover:bg-opacity-10 transition duration-150">
                          <td className="py-3 px-4 text-lg">{image.id}</td>
                          <td className="py-3 px-4 text-lg">{image.name}</td>
                          <td className={`py-3 px-4 text-lg font-semibold ${
                            image.status === 'Completed' ? 'text-green-300' :
                            image.status === 'Processing' ? 'text-yellow-300' : 'text-red-300'
                          }`}>
                            {image.status}
                          </td>
                          <td className="py-3 px-4 text-lg">{image.progress}</td>
                          <td className="py-3 px-4 text-lg">{image.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-xl text-gray-300 py-4">No images uploaded yet.</p>
              )}
              <div className="text-center mt-6">
                <button
                  onClick={() => navigate('/upload-image')}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-5 rounded-lg shadow-md transition duration-300"
                >
                  View All Images
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
