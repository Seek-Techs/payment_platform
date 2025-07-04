// frontend-new/src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { login, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login form submitted."); // DIAGNOSTIC
    setError(null);
    setSuccessMessage(null);

    if (!username || !password) {
      setError('Please enter both username and password.');
      console.log("Login validation failed: missing fields."); // DIAGNOSTIC
      return;
    }

    console.log("Attempting login with:", { username, password }); // DIAGNOSTIC
    const result = await login(username, password);
    console.log("Login result from AuthContext:", result); // DIAGNOSTIC

    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
    } else {
      setSuccessMessage('Login successful! Redirecting...');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-indigo-800 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          ConStruct Payments Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              disabled={isLoading}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              disabled={isLoading}
              required
            />
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-xl"
            disabled={isLoading}
          >
            {isLoading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <p className="text-lg text-gray-700 mt-6">
          Don't have an account?{' '}
          <NavLink
            to="/register"
            className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
          >
            Register
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
