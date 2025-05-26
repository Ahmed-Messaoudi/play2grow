"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/notifications", { withCredentials: true })
      .then(res => setNotifications(res.data))
      .catch(err => console.error("Failed to load notifications", err));
  }, []);

  const markAsRead = async (id: number) => {
    await axios.put(`http://localhost:3001/notifications/${id}/read`, {}, { withCredentials: true });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  return (
    <div className="p-4 bg-white rounded shadow w-80">
      <h2 className="text-lg font-bold mb-2">Notifications</h2>
      {notifications.length === 0 && <p>No notifications</p>}
      <ul className="space-y-2">
        {notifications.map((notif: any) => (
          <li key={notif.id} className={`p-2 border rounded ${notif.isRead ? "bg-gray-200" : "bg-yellow-100"}`}>
            <p>{notif.message}</p>
            {!notif.isRead && (
              <button
                className="text-sm text-blue-500"
                onClick={() => markAsRead(notif.id)}
              >
                Mark as read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
