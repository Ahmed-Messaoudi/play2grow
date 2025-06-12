'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SelectChildPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/children", {
          credentials: "include",
        });
        const data = await res.json();
        setChildren(data);
      } catch (error) {
        console.error("Error fetching children:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  const handleSelectChild = (childId: string) => {
    localStorage.setItem("childId", childId);
    router.push("/");
  };

  if (loading) return <p className="text-center mt-10">Loading children...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Choose a child</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => handleSelectChild(child.id)}
            className="bg-white border hover:border-blue-500 shadow rounded-lg px-6 py-4 text-lg font-medium transition text-black"
          >
            👶 {child.firstName || child.email}
          </button>
        ))}
      </div>
    </div>
  );
}
