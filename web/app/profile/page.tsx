'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/profilecard";
import NotificationCenter from "@/components/NotificationCenter";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });

  useEffect(() => {
    axios.get("http://localhost:3001/me", { withCredentials: true })
      .then(response => {
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          email: response.data.email,
        });
        setLoading(false);
      })
      .catch(error => {
        console.error("User not authenticated:", error);
        router.push("/");
      });
  }, [router]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios.put("http://localhost:3001/me", formData, { withCredentials: true })
      .then(res => {
        setUser(res.data);
        setEditing(false);
      })
      .catch(err => {
        console.error("Failed to update profile", err);
      });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {user && <NotificationCenter />}
      {!editing ? (
        <>
          {user && <ProfileCard user={user} />}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>
        </>
      ) : (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <input
            className="w-full border px-3 py-2 rounded"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
