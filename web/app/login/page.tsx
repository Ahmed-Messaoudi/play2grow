'use client'
import { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    window.location.href = "http://localhost:3001/login"; // Redirect to backend login route
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to login...</p>
    </div>
  );
};

export default Login;
