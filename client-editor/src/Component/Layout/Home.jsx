import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/actions/authAction';
import LoginForm from '../Auth/LoginForm';
import RegisterForm from '../Auth/RegistrationForm';
import '../../App.css';

function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);


  const handleLogin = (credentials) => {
    dispatch(loginUser(credentials))
      .then(() => {

      });
  };
  const handleRegisterSuccess = () => {
    setIsLogin(true); 
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{background: 'radial-gradient(circle, rgba(222,217,219,1) 0%, rgba(138,158,181,1) 100%)', minHeight: '80vh' }}
    >
      <div className="row w-100 align-items-center justify-content-center">

        {/* Slogan Section */}
        <div className="col-md-6 text-start my-4">
          <h2 className="display-1 text-dark" style={{marginLeft:"20px"}} >
            "Transform Ideas into Impactful Content – Simple, Powerful, Limitless."
          </h2>
        </div>

        {/* Authentication Section */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="auth-container w-100">
            <div className="auth-header d-flex justify-content-center mb-3">
              <button
                className={isLogin ? 'active' : ''}
                onClick={() => setIsLogin(true)}
              >
                Log In
              </button>
              <button
                className={!isLogin ? 'active' : ''}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
      
          </div>

          {error && <p className="text-danger text-center">{error}</p>}
          {isLogin ? (
            <LoginForm onSubmit={handleLogin} />
          ) : (
            <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
          )}
        </div>
      </div>
    </div>
    </div >
);

}

export default Home;
