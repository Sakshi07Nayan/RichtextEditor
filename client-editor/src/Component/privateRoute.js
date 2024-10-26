import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // For accessing Redux state

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Get auth status

  return isAuthenticated ? children : <Navigate to="/" />; // Redirect to the main page with login form if not authenticated
};

export default PrivateRoute;