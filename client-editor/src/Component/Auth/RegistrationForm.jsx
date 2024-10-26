import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginWithGoogle } from '../../store/actions/authAction';
import { FaGoogle } from 'react-icons/fa';

const RegistrationForm = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: '',
    name: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Trim whitespace from inputs
      const trimmedData = {
        email: userData.email.trim(),
        name: userData.name.trim(),
        password: userData.password
      };

      const result = await dispatch(registerUser(trimmedData));
      
      if (result.success) {
        alert('Registration successful! Please log in.');
        if (props.onRegisterSuccess) {
          props.onRegisterSuccess();
        }
        navigate('/');
      } else {
        setError(result.error);
        alert(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="auth-form register-form">
      <h2 className="text-primary">SIGN UP</h2>
      <div className="auth-options">
        <button className="google-auth"
         onClick={handleGoogleSignup}>
          <FaGoogle /> Sign up with Google
        </button>
      </div>
      <div className="separator">or</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="User name"
          value={userData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="john@example.com"
          value={userData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="your password"
          value={userData.password}
          onChange={handleChange}
          required
        />
        <div className="terms">
          By signing up, you agree to our terms of service and privacy policy
        </div>
        <button type="submit" className="submit-btn">
          SIGN UP
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
