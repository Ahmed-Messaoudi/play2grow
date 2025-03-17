"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => signIn("keycloak")}
      >
        Login with Keycloak
      </button>
    </div>
  );
}
