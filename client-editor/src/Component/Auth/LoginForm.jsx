import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { loginUser} from '../../store/actions/authAction';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector(state => state.auth);
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated) {
      navigate('/dashboard'); 
    }
  }, [isAuthenticated, navigate]);

  // Handle Google login
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setFormError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    const result = await dispatch(loginUser(credentials));
    if (!result.success) {
      setFormError(result.error);
    }
  };

  return (
    <div className="auth-form login-form">
      <h2 className="text-primary">SIGN IN</h2>
      
      {formError && (
        <div className="error-message">
          {formError}
        </div>
      )}

      <div className="auth-options">
        <button 
          className="google-auth" 
          onClick={handleGoogleLogin}
          type="button"
        >
          <FaGoogle /> Sign in with Google
        </button>
      </div>
      
      <div className="separator">or</div>
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <div className="forgot-password">
          <a href="/forgot-password">Don't remember your password?</a>
        </div>
        <button type="submit" className="submit-btn">
          LOG IN
        </button>
      </form>
    </div>
  );
};

export default LoginForm;