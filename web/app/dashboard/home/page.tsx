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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categoryDescriptions: Record<string, string> = {
    quizzes: "🧩 Quizzes: Test their knowledge and improve retention through gamified questions.",
    coloring: "🎨 Coloring: Enhance creativity, focus, and fine motor skills in a fun and relaxing way.",
    dragAndDrop: "🧲 Drag and Drop: Improve logic, hand-eye coordination, and problem-solving abilities."
  };



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
            <p className="font-semibold text-lg">{child.name}</p>
            <p>🧩 Quizzes: <strong>{child.totalQuizzes}</strong></p>
            <p>📈 Avg Score: <strong>{child.averageScore}</strong></p>
            <p>⏱️ Total Time: <strong>{child.totalTime} sec</strong></p>
            <p>🕓 Last Played: <strong>{child.lastPlayed ? new Date(child.lastPlayed).toLocaleString() : "Never"}</strong></p>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-green-800">🎯 Suggest an Activity</h2>
        <p className="text-black mb-4">
          Select an activity you'd like to suggest for your child based on his performance and interests :
        </p>

        <select
          className="p-2 border rounded-md bg-white text-black"
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="" disabled>Select a category</option>
          <option value="quizzes">Quizzes</option>
          <option value="coloring">Coloring</option>
          <option value="dragAndDrop">Drag and Drop</option>
        </select>

        {selectedCategory && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md text-blue-800 border border-blue-200">
            <p>{categoryDescriptions[selectedCategory]}</p>
          </div>
        )}
      </div>


    </div>
  );
}
