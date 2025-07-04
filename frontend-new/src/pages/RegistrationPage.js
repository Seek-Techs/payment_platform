// frontend-new/src/pages/RegistrationPage.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';

const RegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { register, isLoading } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate(); // Suppress 'navigate' unused warning as NavLink implicitly uses it

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Registration form submitted."); // DIAGNOSTIC
    setError(null);
    setSuccessMessage(null);

    if (!username || !email || !password || !password2) {
      setError('All fields are required.');
      console.log("Registration validation failed: missing fields."); // DIAGNOSTIC
      return;
    }
    if (password !== password2) {
      setError('Passwords do not match.');
      console.log("Registration validation failed: passwords mismatch."); // DIAGNOSTIC
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      console.log("Registration validation failed: password too short."); // DIAGNOSTIC
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      console.log("Registration validation failed: invalid email."); // DIAGNOSTIC
      return;
    }

    console.log("Attempting registration with:", { username, email, password, password2 }); // DIAGNOSTIC
    const result = await register(username, email, password, password2);
    console.log("Registration result from AuthContext:", result); // DIAGNOSTIC

    if (!result.success) {
      setError(result.error || 'Registration failed. Please try again.');
    } else {
      setSuccessMessage('Registration successful! Redirecting...');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 to-pink-900 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          ConStruct Payments Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              disabled={isLoading}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              disabled={isLoading}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
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
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 text-xl"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-lg text-gray-700 mt-6">
          Already have an account?{' '}
          <NavLink
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300"
          >
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
