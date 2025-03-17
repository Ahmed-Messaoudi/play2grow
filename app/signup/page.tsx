"use client";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => window.location.href = "http://localhost:8080/realms/play2grow/protocol/openid-connect/registrations?client_id=next&response_type=code"}
      >
        Sign Up with Keycloak
      </button>
    </div>
  );
}
