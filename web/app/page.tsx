'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import gameroom from "@/public/gameroom.jpg"
import numbers from "@/public/numbers.jpg"
import children from "@/public/children.jpg"
import { div } from "framer-motion/client";
import logo from "@/public/logo.png";
import music from "@/public/music.png";
import settings from "@/public/settings.png";
import play from "@/public/play.png";



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
    <div className=" mt-[20px] container mx-auto flex items-center justify-center h-[660px] w-[1920px] rounded-[30px] "
    style = {{backgroundImage : "url('/home.png')", backgroundSize: "cover"}}>
      
      {!user ? (
        <section>
          <div className="flex flex-col gap-23 w-[1000px] h-[500px]">
            <div className="ml-[350px]">
              <Image alt="logo" src={logo} ></Image>
            </div>
            <div className="flex items-center justify-center ">
        <button onClick={handleLogin} className="px-4 py-2 rounded">
          <Image alt="play" src={play}></Image>
        </button>
        </div>
        <div className="flex flex-row ">
          <div className="">
          <Image alt="music" src={music}></Image>
          </div>
          <div className="ml-[900px]">
              <Image alt="settings" src={settings}></Image>
            </div>
        </div>
        </div>
        </section>
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
