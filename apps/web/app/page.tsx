// web/pages/index.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import logo from '@/public/logo.png'

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
    <main style={{ padding: '2rem' }}
    className={`w-screen h-screen flex flex-col items-center justify-center ${
    user ? 'bg-purple-500' : 'bg-white'
  } text-black`}>
      {user ? (
        <>
          <h1>
  Welcome,{' '}
  <span
    onClick={() => window.location.href = '/profile'}
    className="text-blue-800 underline cursor-pointer hover:text-blue-600"
  >
    {user.username}
  </span>{' '}
  👋
</h1>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <div className='flex items-center justify-center'>
            <Image
          src={logo}
          alt="Logo"
          className='mt-[5px] mb-[80px]'></Image>
          </div>
          <div className='flex flex-col items-center justify-center gap-4'>
          <h1 className='font-bold text-[60px]'>Welcome to Play2Grow</h1>
          <p className='font-semibold text-blue-950'>Play2Grow is a platform designed to enhance your cognitive skills through engaging games and activities.</p>
          <h1>You are not logged in</h1>
          <button onClick={handleLogin} className='bg-green-600 w-[230px] h-[50px] hover:bg-blue-700 rounded-[10px]'>Login with Keycloak</button>
          </div>
        </>
      )}
    </main>
  );
}
