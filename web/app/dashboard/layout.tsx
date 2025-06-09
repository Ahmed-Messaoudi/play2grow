"use client";
// ✅ /web/app/dashboard/layout.tsx
import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const passcode = localStorage.getItem("dashboardPasscode");
    if (!passcode) {
      router.push("/passcode");
    }
  }, []);

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard/home" className="hover:underline">🏠 Home</Link>
          <Link href="/dashboard/children" className="hover:underline">👶 Children</Link>
          <Link href="/dashboard/progress" className="hover:underline">📈 Progress</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">{children}</main>
    </div>
  );
}
