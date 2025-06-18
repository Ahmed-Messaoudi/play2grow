'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import gameroom from "@/public/gameroom.jpg"
import numbers from "@/public/numbers.png"
import children from "@/public/children.jpg"
import { div } from "framer-motion/client";
import logo from "@/public/logo.png";
import music from "@/public/music.png";
import settings from "@/public/settings.png";
import play from "@/public/play.png";
import coloring from "@/public/coloring.jpg";
import listening from "@/public/listening.jpg";



interface User {
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
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


  const handleAccessDashboard = () => {
    const storedPasscode = localStorage.getItem('dashboardPasscode')
    const inputPasscode = prompt('Enter your dashboard passcode')

    if (inputPasscode === storedPasscode) {
      router.push('/dashboard/home')
    } else {
      alert('Incorrect passcode!')
    }
  }

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
      style={{ backgroundImage: "url('/home.png')", backgroundSize: "cover" }}>

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
        <section className="flex flex-col items-center rounded-[50px] ">
          <div className="flex flex-row items-center justify-between w-full p-4">
            <a href="/profile"><div className="w-[52px] h-[52px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-bold">
        {user.firstName?.[0]?.toUpperCase() || "U"}</div><div className="flex flex-row"></div></a>
            <button
              onClick={handleAccessDashboard}
              className="px-6 py-3 bg-[#a024acb0] text-white font-semibold rounded-lg shadow hover:bg-blue-900 transition duration-200 ml-[900px]"
            >
              Parent
            </button>
          </div>
          <div className=" flex flex-row w-auto h-[500px]  bg-[#731ab39f] rounded-[20px] overflow-x-auto">
            <div className="flex flex-col ml-[20px] mt-[30px] w-[300px] h-[400px] bg-white rounded-[20px]">
              <Image src={numbers} alt="Placeholder" className="w-full h-[200px] rounded-t-[20px]" />
              <h6 className="text-black font-bold mt-[10px] ml-[20px]">🧩 Quizzes</h6>
              <p className="text-black ml-[20px]">Answer fun questions and show how smart you are! Every quiz is a chance to discover something new!</p>
              <button className="mt-[20px] ml-[20px] px-4 py-2 bg-[#731ab39f] text-white rounded-[10px] w-[120px] h-[40px]">START</button>
            </div>
            <div className="flex flex-col ml-[20px] mt-[30px] w-[300px] h-[400px] bg-white rounded-[20px]">
              <Image src={coloring} alt="Placeholder" className="w-full h-[200px] rounded-t-[20px]" />
              <h6 className="text-black font-bold mt-[10px] ml-[20px]">🎨 Coloring</h6>
              <p className="text-black ml-[20px]">Bring pictures to life with your favorite colors! Let your imagination paint the world!</p>
              <button className="mt-[20px] ml-[20px] px-4 py-2 bg-[#731ab39f] text-white rounded-[10px] w-[120px] h-[40px]">START</button>
            </div>
            <div className="flex flex-col ml-[20px] mt-[30px] w-[300px] h-[400px] bg-white rounded-[20px]">
              <Image src={gameroom} alt="Placeholder" className="w-full h-[200px] rounded-t-[20px]" />
              <h6 className="text-black font-bold mt-[10px] ml-[20px]">🧲 Drag and Drop</h6>
              <p className="text-black ml-[20px]">Match, move, and solve fun puzzles! Drag your way to victory while training your brain!</p>
              <button className="mt-[20px] ml-[20px] px-4 py-2 bg-[#731ab39f] text-white rounded-[10px] w-[120px] h-[40px]">START</button>
            </div>
            <div className="flex flex-col ml-[20px] mt-[30px] w-[300px] h-[400px] bg-white rounded-[20px]">
              <Image src={listening} alt="Placeholder" className="w-full h-[200px] rounded-t-[20px]" />
              <h6 className="text-black font-bold mt-[10px] ml-[20px]">🎧 Listening</h6>
              <p className="text-black ml-[20px]">Listen carefully to exciting sounds and stories! Great adventures start with good ears!</p>
              <button className="mt-[20px] ml-[20px] px-4 py-2 bg-[#731ab39f] text-white rounded-[10px] w-[120px] h-[40px]">START</button>
            </div>

          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
