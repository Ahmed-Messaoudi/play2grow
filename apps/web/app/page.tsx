// web/pages/index.tsx
'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/user', {
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = () => {
    window.location.href = 'http://localhost:4000/api/login';
  };

  const handleLogout = () => {
    window.location.href = 'http://localhost:4000/api/logout';
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main style={{ padding: '2rem' }}>
      {user ? (
        <>
          <h1>Welcome, {user.username} 👋</h1>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <h1>You are not logged in</h1>
          <button onClick={handleLogin}>Login with Keycloak</button>
        </>
      )}
    </main>
  );
}
