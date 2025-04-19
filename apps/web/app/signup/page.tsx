import React from 'react';

const SignupPage = () => {
  const handleSignup = () => {
    // Redirect to the Keycloak registration page
    window.location.href = 'http://localhost:8080/realms/play2grow/protocol/openid-connect/registrations?client_id=next&response_type=code&redirect_uri=http://localhost:3000';
  };

  return (
    <div>
      <h1>Sign Up Page</h1>
      <button onClick={handleSignup}>Sign up with Keycloak</button>
    </div>
  );
};

export default SignupPage;
