import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPage.css'; // Make sure this file is created and linked.

function ErrorPage() {
  const navigate = useNavigate();

  const handleHomePageNavigation = () => {
    navigate('/');
  };

  return (
    <div className="error-page-container">
      <div className="error-page-content">
        <h1 className="error-title">404</h1>
        <p className="error-message">Oops! Page not found.</p>
        <p className="error-description">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <button className="error-button" onClick={handleHomePageNavigation}>
          Go to Homepage
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
