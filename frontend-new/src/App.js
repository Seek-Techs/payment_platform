// frontend-new/src/App.js
import React, { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // Removed BrowserRouter as it's in index.js

// Import all our page components
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MyPaymentsPage from './pages/MyPaymentsPage';
import PaymentDetailPage from './pages/PaymentDetailPage';
import InitiatePaymentForm from './pages/InitiatePaymentForm';
import ImageUploadPage from './pages/ImageUploadPage';
import ImageDetailPage from './pages/ImageDetailPage';
import RegistrationPage from './pages/RegistrationPage';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const { token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    // Still checking auth status, show a loading indicator
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading application...</p>
      </div>
    );
  }

  // If authenticated, render the children (the protected component)
  // If not authenticated, redirect to the login page
  return token ? children : <Navigate to="/login" replace />;
};

// Main App component that defines the routing structure
const App = () => { // Renamed back to App as it's the main component for routes
  const { token, isLoading } = useContext(AuthContext);
  const navigate = useNavigate(); // Get navigate function for 404 page

  // Show a loading screen while authentication state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading application...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <RegistrationPage />} />

      {/* Protected Routes - wrapped by PrivateRoute */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/payments" element={<PrivateRoute><MyPaymentsPage /></PrivateRoute>} />
      <Route path="/payments/:id" element={<PrivateRoute><PaymentDetailPage /></PrivateRoute>} />
      <Route path="/initiate-payment" element={<PrivateRoute><InitiatePaymentForm /></PrivateRoute>} />
      <Route path="/upload-image" element={<PrivateRoute><ImageUploadPage /></PrivateRoute>} />
      <Route path="/images/:id" element={<PrivateRoute><ImageDetailPage /></PrivateRoute>} />

      {/* Default route: Redirect to dashboard if logged in, else to login */}
      <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

      {/* Catch-all route for 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
          <h1 className="text-5xl font-bold mb-4">404</h1>
          <p className="text-xl mb-6">Page Not Found</p>
          <button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">Go Home</button>
        </div>
      } />
    </Routes>
  );
};

export default App;
