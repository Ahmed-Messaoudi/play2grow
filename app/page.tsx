"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // Redirect to home page (app/page.tsx)
    }
  }, [status, router]);

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
