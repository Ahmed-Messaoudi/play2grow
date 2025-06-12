'use client';

import { useEffect, useState } from "react";

type ChildSummary = {
  childId: string;
  name: string;
  totalQuizzes: number;
  averageScore: string;
  totalTime: number;
  lastPlayed: string | null;
};

export default function DashboardHome() {
  const [summary, setSummary] = useState<ChildSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      const res = await fetch("http://localhost:3001/api/dashboard/home");
      const data = await res.json();
      setSummary(data);
      setLoading(false);
    };

    fetchSummary();
  }, []);

  if (loading) return <p className="text-center mt-10">⏳ Loading dashboard...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">📊 Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {summary.map((child) => (
          <div key={child.childId} className="bg-white shadow-lg rounded-xl p-6 text-black">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">{child.name}</h2>
            <p>🧩 Quizzes: <strong>{child.totalQuizzes}</strong></p>
            <p>📈 Avg Score: <strong>{child.averageScore}</strong></p>
            <p>⏱️ Total Time: <strong>{child.totalTime} sec</strong></p>
            <p>🕓 Last Played: <strong>{child.lastPlayed ? new Date(child.lastPlayed).toLocaleString() : "Never"}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}
