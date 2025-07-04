// frontend-new/src/components/Navbar.js
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Keep useNavigate as NavLink uses it internally
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // This is correctly assigned and implicitly used by NavLink

  const handleLogout = () => {
    logout(); // AuthContext's logout now handles redirection
  };

  return (
    <nav className="bg-gray-900 bg-opacity-80 p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand/Logo */}
        <NavLink to="/dashboard" className="text-white text-2xl font-bold tracking-wider hover:text-blue-300 transition duration-200">
          ConStruct Payments
        </NavLink>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-lg font-semibold px-3 py-2 rounded-lg transition duration-200 ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/payments"
            className={({ isActive }) =>
              `text-lg font-semibold px-3 py-2 rounded-lg transition duration-200 ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            My Payments
          </NavLink>
          <NavLink
            to="/initiate-payment"
            className={({ isActive }) =>
              `text-lg font-semibold px-3 py-2 rounded-lg transition duration-200 ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            Initiate Payment
          </NavLink>
          <NavLink
            to="/upload-image"
            className={({ isActive }) =>
              `text-lg font-semibold px-3 py-2 rounded-lg transition duration-200 ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            Upload Image
          </NavLink>
        </div>

        {/* User Info and Logout */}
        <div className="flex items-center space-x-4">
          {user && <span className="text-white text-lg">Hello, {user.username || 'User'}!</span>}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-md"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
