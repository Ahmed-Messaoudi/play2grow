'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PasscodePage() {
  const router = useRouter();
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    if (code === '1234') {
      localStorage.setItem('dashboardPasscode', code);
      router.push('/dashboard');
    } else {
      alert('Incorrect passcode');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-xl mb-4">Enter Passcode</h1>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
          Enter
        </button>
      </div>
    </div>
  );
}
