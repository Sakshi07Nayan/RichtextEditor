import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';

const AuthTab = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="max-w-lg mx-auto mt-10">
      <div className="flex justify-center space-x-8">
        <button
          onClick={() => setIsLogin(true)}
          className={`px-4 py-2 ${isLogin ? 'border-b-4 border-indigo-500' : ''} text-gray-700`}
        >
          Log In
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`px-4 py-2 ${!isLogin ? 'border-b-4 border-indigo-500' : ''} text-gray-700`}
        >
          Sign Up
        </button>
      </div>

      <div className="mt-6">
        {isLogin ? <LoginForm /> : <RegistrationForm />}
      </div>
    </div>
  );
};

export default AuthTab;
