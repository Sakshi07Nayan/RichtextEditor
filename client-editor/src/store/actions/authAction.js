import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Set auth token in axios defaults
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Register user
export const registerUser = (userData) => async (dispatch) => {
  try {
    // Input validation
    if (!userData.email || !userData.password || !userData.name) {
      throw new Error('All fields are required');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Please enter a valid email address');
    }

    // Password validation
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Configure headers
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    // Make API call
    const response = await axios.post(
      `${API_URL}/register`, 
      userData,
      config
    );
    
    const { token, user } = response.data;
    
    // Set token in localStorage
    localStorage.setItem('token', token);
    setAuthToken(token);

    dispatch({
      type: 'REGISTER_SUCCESS',
      payload: { user }
    });

    return { success: true };
  } catch (error) {
    let errorMessage;
    
    if (error.response) {
      // Server responded with error
      errorMessage = error.response.data.message || 
                    error.response.data.errors?.[0]?.msg ||
                    'Registration failed';
    } else if (error.message) {
      // Client-side validation error
      errorMessage = error.message;
    } else {
      // Network error or other issues
      errorMessage = 'Registration failed. Please check your connection and try again.';
    }
    
    dispatch({
      type: 'REGISTER_FAIL',
      payload: errorMessage
    });

    return { success: false, error: errorMessage };
  }
};

// Login user
export const loginUser = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    
    const { token, user } = response.data;
    
    // Set token in localStorage
    localStorage.setItem('token', token);
    setAuthToken(token);

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user }
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    
    dispatch({
      type: 'LOGIN_FAIL',
      payload: errorMessage
    });

    return { success: false, error: errorMessage };
  }
};

// Handle Google OAuth Success
export const handleGoogleAuthSuccess = (token) => async (dispatch) => {
  try {
    // Set token in localStorage
    localStorage.setItem('token', token);
    setAuthToken(token);

    // Get user data using the token
    const response = await axios.get(`${API_URL}/me`);
    
    dispatch({
      type: 'GOOGLE_LOGIN_SUCCESS',
      payload: { user: response.data.user }
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Google authentication failed';
    
    dispatch({
      type: 'GOOGLE_LOGIN_FAIL',
      payload: errorMessage
    });

    return { success: false, error: errorMessage };
  }
};

// Logout user
export const logoutUser = () => async (dispatch) => {
  try {
    await axios.post(`${API_URL}/logout`);
    
    // Remove token from localStorage
    localStorage.removeItem('token');
    setAuthToken(null);

    dispatch({ type: 'LOGOUT_SUCCESS' });
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove token and dispatch logout even if the API call fails
    localStorage.removeItem('token');
    setAuthToken(null);
    dispatch({ type: 'LOGOUT_SUCCESS' });
    return { success: true };
  }
};
