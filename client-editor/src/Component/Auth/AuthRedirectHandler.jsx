import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleGoogleAuthSuccess } from '../../store/actions/authAction';

const AuthRedirectHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');

      if (token) {
        try {
          // Dispatch action to handle Google auth success
          await dispatch(handleGoogleAuthSuccess(token));
          window.history.replaceState({}, document.title, window.location.pathname);
          navigate('/dashboard');
        } catch (error) {
          console.error('Auth redirect error:', error);
          navigate('/');
        }
      }
    };

    handleAuthRedirect();
  }, [dispatch, navigate, location]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2>Authenticating...</h2>
      </div>
    </div>
  );
};

export default AuthRedirectHandler;