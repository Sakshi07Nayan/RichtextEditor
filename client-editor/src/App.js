import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Component/Layout/header';
import Footer from './Component/Layout/Footer';
import Home from './Component/Layout/Home';
import LandingPage from './Component/Pages/LandingPage';
import PrivateRoute from './Component/privateRoute';
import AuthRedirectHandler from './Component/Auth/AuthRedirectHandler';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Header />
      <Routes>
        {/* Public route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Home />
                <Footer />
              </>
            )
          }
        />

        {/* Auth redirect route */}
        <Route path="/auth/callback" element={<AuthRedirectHandler />} />

        {/* Protected dashboard route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <LandingPage />
            </PrivateRoute>
          }
        />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;