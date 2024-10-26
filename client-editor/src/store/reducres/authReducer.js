// src/store/reducers/authReducer.js
const initialState = {
    user: null,
    isAuthenticated: false,
    error: null,
  };
  
  export default function authReducer(state = initialState, action) {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        return{
          ...state,
          user: action.payload.user,
          isAuthenticated: true,
          error: null,
        }
        case 'GOOGLE_LOGIN_SUCCESS':  // Handle both normal and Google login success
        return {
          ...state,
          user: action.payload.user,
          isAuthenticated: true,
          error: null,
        };
      case 'REGISTER_SUCCESS':
        return {
          ...state,
          user: action.payload.user,
          isAuthenticated: false,
          error: null,
        };
      case 'LOGIN_FAIL':
      case 'REGISTER_FAIL':
        return {
          ...state,
          user: null,
          isAuthenticated: false,
          error: action.payload,
        };
        case 'GOOGLE_LOGIN_FAIL':  // Handle Google login failure
        return {
          ...state,
          user: null,
          isAuthenticated: false,
          error: action.payload,
        };
        case 'LOGOUT_SUCCESS':
          return {
            ...state,
            isAuthenticated: false,
            user: null // Reset user data upon logout
          };  
      default:
        return state;
    }
  }
  