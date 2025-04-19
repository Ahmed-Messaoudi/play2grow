'use client';
import Image from 'next/image';
import logo from '@/public/logo.png';

export default function Home() {
  return (
    <main className="bg-white flex min-h-screen flex-col items-center justify-center gap-4">
      <Image
        src={logo}
        alt="Logo"
        width={500}
        height={300}
        priority
      />
      <a
  href="http://localhost:4000/api/login"
  className="bg-purple-600 text-white px-4 py-2 rounded w-[120px] text-center mt-[20px]"
>
  Login
</a>

<a
  href="http://localhost:4000/api/signup"
  className="mt-[20px] bg-green-600 text-white px-4 py-2 rounded w-[120px] text-center"
>
  Sign up
</a>
    </main>
  );
}
