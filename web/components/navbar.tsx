import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/me", { withCredentials: true })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.log("No user logged in");
      });
  }, []);

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <ul className="flex justify-between">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          {!user ? (
            <Link href="/login">Login</Link>
          ) : (
            <Link href="/profile">Profile</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
