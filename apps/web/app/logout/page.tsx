// web/app/logout/page.tsx
export default function LogoutPage() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1>Logging out...</h1>
        <a
          href="http://localhost:4000/api/logout"
          className="bg-red-500 text-white px-4 py-2 mt-4 rounded"
        >
          Logout from Keycloak
        </a>
      </main>
    );
  }
  