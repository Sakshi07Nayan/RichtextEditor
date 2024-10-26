import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Helper function to get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Action Creators
export const createContent = (contentData) => async (dispatch) => {
  try {
    dispatch({ type: 'CREATE_CONTENT_REQUEST' });
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }
    // Configure headers with authentication token
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const { data } = await axios.post(`${API_URL}/api/content`, contentData, config);

    dispatch({
      type: 'CREATE_CONTENT_SUCCESS',
      payload: data
    });

    return Promise.resolve(data);
  } catch (error) {
    let errorMessage;
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = 'Session expired. Please login again.';
          dispatch({ type: 'LOGOUT_SUCCESS' });
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        default:
          errorMessage = error.response.data.message || 'Failed to create content.';
      }
    } else if (error.message) {
      errorMessage = error.message;
    } else {
      errorMessage = 'An error occurred while creating content.';
    }

    dispatch({
      type: 'CREATE_CONTENT_FAIL',
      payload: errorMessage
    });

    return Promise.reject(errorMessage);
  }
};

export const getAllContent = () => async (dispatch) => {
    try {
      dispatch({ type: 'GET_CONTENT_REQUEST' });
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please login first.');
      }
  
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
  
      const { data } = await axios.get(`${API_URL}/api/content`, config);
  
      dispatch({
        type: 'GET_CONTENT_SUCCESS',
        payload: data
      });
    } catch (error) {
      dispatch({
        type: 'GET_CONTENT_FAIL',
        payload: error.response?.data?.message || error.message
      });
    }
  };
  
  export const updateContent = (id, contentData) => async (dispatch) => {
    try {
      dispatch({ type: 'UPDATE_CONTENT_REQUEST' });
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please login first.');
      }
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
  
      const { data } = await axios.put(`${API_URL}/api/content/${id}`, contentData, config);
  
      dispatch({
        type: 'UPDATE_CONTENT_SUCCESS',
        payload: data
      });
  
      return Promise.resolve(data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: 'UPDATE_CONTENT_FAIL',
        payload: errorMessage
      });
      return Promise.reject(errorMessage);
    }
  };
  
  export const deleteContent = (id) => async (dispatch) => {
    try {
      dispatch({ type: 'DELETE_CONTENT_REQUEST' });
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Authentication required. Please login first.');
      }
  
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
  
      await axios.delete(`${API_URL}/api/content/${id}`, config);
  
      dispatch({
        type: 'DELETE_CONTENT_SUCCESS',
        payload: id
      });
  
      return Promise.resolve();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: 'DELETE_CONTENT_FAIL',
        payload: errorMessage
      });
      return Promise.reject(errorMessage);
    }
  };
  