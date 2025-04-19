'use client';

import { useEffect, useState } from 'react';

export default function ProtectedPage() {
  const [data, setData] = useState<string>('');

  useEffect(() => {
    fetch('http://localhost:4000/api/protected', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.text();
      })
      .then(setData)
      .catch(() => setData('Access Denied ❌'));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Protected Page</h1>
      <p>{data}</p>
    </main>
  );
}
