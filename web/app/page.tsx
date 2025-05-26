'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import gameroom from "@/public/gameroom.jpg"
import numbers from "@/public/numbers.jpg"
import children from "@/public/children.jpg"



interface User {
  name: string;
  // add more fields if needed
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    axios.get("http://localhost:3001/me", { withCredentials: true })
      .then(response => {
        setUser(response.data);
      })
      .catch(() => {
        console.log("No user logged in");
      });
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    // Use browser navigation to follow redirect chain
    window.location.href = "http://localhost:3001/logout";
  };
  ;

  return (
    <div className="container mx-auto flex items-center justify-center h-screen w-[1920px] bg-green-500">
      
      {!user ? (
        <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded">
          Login
        </button>
      ) : (
        <section className="flex flex-col items-center bg-green-500 rounded-[50px] ">
          <div className="flex flex-row items-center justify-between w-full p-4 bg-gray-200">
          <a href="/profile"><h1 className=" text-2xl font-bold text-black">Welcome, {user.name}</h1></a>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">
            Logout
          </button>
          </div>
          <div className=" flex flex-row w-auto h-[500px] bg-purple-500">
            <div className="flex flex-col ml-[20px] mt-[30px] w-[300px] h-[400px] bg-white rounded-[20px]">
              <Image src={numbers} alt="Placeholder" className="w-full h-[200px] rounded-t-[20px]" />
              <h6 className="text-black font-bold mt-[10px] ml-[20px]">game title</h6>
              <button className="mt-[110px] ml-[170px] px-4 py-2 bg-blue-500 text-white rounded-[10px] w-[120px] h-[40px]">START</button>
            </div>
            <div className="flex flex-col ml-[20px] mt-[30px] w-[300px] h-[400px] bg-white rounded-[20px]">
              <Image src={numbers} alt="Placeholder" className="w-full h-[200px] rounded-t-[20px]" />
              <button className="mt-[140px] ml-[170px] px-4 py-2 bg-blue-500 text-white rounded-[10px] w-[120px] h-[40px]">START</button>
            </div>
            <div className="flex flex-col ml-[20px] mt-[30px] w-[300px] h-[400px] bg-white rounded-[20px]">
              <Image src={gameroom} alt="Placeholder" className="w-full h-[200px] rounded-t-[20px]" />
              <button className="mt-[140px] ml-[170px] px-4 py-2 bg-blue-500 text-white rounded-[10px] w-[120px] h-[40px]">START</button>
            </div>
            <div className="flex flex-col ml-[20px] mt-[30px] w-[300px] h-[400px] bg-white rounded-[20px]">
              <Image src={numbers} alt="Placeholder" className="w-full h-[200px] rounded-t-[20px]" />
              <button className="mt-[140px] ml-[170px] px-4 py-2 bg-blue-500 text-white rounded-[10px] w-[120px] h-[40px]">START</button>
            </div>

          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
