'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // <<< ADD THIS
import ProfileCard from "@/components/profilecard";

const Profile = () => {
  const router = useRouter(); // <<< ADD THIS
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <<< Add a loading state

  useEffect(() => {
    axios.get("http://localhost:3001/me", { withCredentials: true })
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("User not authenticated:", error);
        router.push("/"); // <<< Redirect to home if not authenticated
      });
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto">
      {user && <ProfileCard user={user} />}
    </div>
  );
};

export default Profile;
