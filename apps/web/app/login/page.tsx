'use client';
import React from 'react';

const LoginPage = () => {
  const handleLogin = () => {
    // Redirect to the backend login route
    window.location.href = 'http://localhost:4000/api/login';
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login with Keycloak</button>
    </div>
  );
};

export default LoginPage;
