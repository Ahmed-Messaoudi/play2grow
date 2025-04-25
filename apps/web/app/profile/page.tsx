'use client';

import { useEffect, useState } from 'react';

export default function Profile() {
  const [user, setUser] = useState<{ username: string, email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/user', {
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setEmail(data.email || '');
        } else {
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleProfileUpdate = async () => {
    await fetch('http://localhost:4000/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: user?.username || '', email }),
    });
  };

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <main className="p-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p><strong>Username:</strong> {user.username}</p>

      <label className="flex flex-col">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 p-2 rounded-md"
        />
      </label>

      <button
        onClick={handleProfileUpdate}
        className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded-md w-fit"
      >
        Update Profile
      </button>
    </main>
  );
}
