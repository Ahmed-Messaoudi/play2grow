"use client";
// ✅ /web/app/dashboard/layout.tsx
import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiFillHome } from "react-icons/ai";
import { FaChild, FaUsers } from "react-icons/fa";
import { MdInsights, MdBarChart } from "react-icons/md";


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const passcode = localStorage.getItem("dashboardPasscode");
    if (!passcode) {
      router.push("/passcode");
    }
  }, []);

  const handleLogout = () => {
    // Use browser navigation to follow redirect chain
    window.location.href = "http://localhost:3001/logout";
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <nav className="flex flex-col gap-4">
          <div className="mb-4 text-green-500 flex flex-row rounded-2xl bg-white p-2 items-center justify-center hover:bg-gray-200">
            <Link href="/dashboard/home" className="hover:underline"><div><AiFillHome style={{ fontSize: '34px' }} /></div></Link>
          </div>
          <div className="mb-4 text-green-500 flex flex-row rounded-2xl bg-white p-2 items-center justify-center hover:bg-gray-200">
            <Link href="/dashboard/children" className="hover:underline"><div className="flex"><FaChild style={{ fontSize: '34px' }} /></div></Link>
          </div>
          <div className="mb-4 text-green-500 flex flex-row rounded-2xl bg-white p-2 items-center justify-center hover:bg-gray-200">
            <Link href="/dashboard/progress" className="hover:underline"><div className="flex"><MdInsights style={{ fontSize: '34px' }} /></div></Link>
          </div>
          <div className="mt-[205px] flex flex-row rounded-2xl p-2 items-center justify-center">
            <button onClick={handleLogout} className="w-100% px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-800 transition duration-200">
              Logout
            </button>
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">{children}</main>
    </div>
  );
}
