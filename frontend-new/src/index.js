// frontend-new/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Keep existing CSS import
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext'; // <--- NEW: Import AuthProvider
import { BrowserRouter as Router } from 'react-router-dom'; // <--- NEW: Import Router

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap the entire application with Router and AuthProvider */}
    <Router> {/* <--- NEW: Router wraps everything */}
      <AuthProvider> {/* <--- NEW: AuthProvider wraps App */}
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
