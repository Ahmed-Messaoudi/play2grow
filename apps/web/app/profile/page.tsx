'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:4000/api/user', {
      credentials: 'include', // 👈 VERY IMPORTANT to include cookies
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Not authenticated');
        const data = await res.json();
        setUsername(data.username);
      })
      .catch((err) => {
        console.error('Not authenticated', err);
        router.push('/'); // redirect to homepage or login
      });
  }, []);

  const handleLogout = () => {
    fetch('http://localhost:4000/api/logout', {
      credentials: 'include',
    })
      .then(() => router.push('/'))
      .catch(console.error);
  };

  if (!username) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {username} 🎉</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
