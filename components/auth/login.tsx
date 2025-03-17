'use client'
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import email from "@/public/email.svg";
import password from "@/public/password.svg";


const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "", // Email or Username
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", formData);
    // Handle authentication logic here
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white text-black">
        <div>
            <Image src={logo} alt="Logo" width={400} height={100} />
        </div>
        <h2 className="mb-6 text-center text-2xl font-semibold font-[jua] text-gray-700">Login</h2>
      <div className="w-full max-w-md border-[1px] rounded-[8px] border-[#D9D9D9] bg-white p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex flex-row p-[5px] pb-2">
              <Image src={email} alt="email" width={20} height={20} />
            <label className=" ml-[10px] block text-sm font-semibold text-gray-600">Email or Username</label>
            </div>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              className="w-full p-2 focus:border-blue-500 focus:outline-none border-[1px] rounded-[8px] border-[#D9D9D9]"
              required
            />
          </div>
          <div className="mb-4">
          <div className="flex flex-row p-[5px] pb-2">
              <Image src={password} alt="password" width={20} height={20} />
            <label className=" ml-[10px] block text-sm font-semibold text-gray-600">Password</label>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 focus:border-blue-500 focus:outline-none border-[1px] rounded-[8px] border-[#D9D9D9]"
              required
            />
          </div>
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className=" mt-2 w-full rounded-md bg-gradient-to-r from-[#0090FF] to-[#00FF94] hover:from-[#00FF94] hover:to-[#0090FF] transition-all px-4 py-2 text-white"
          >
            Sign In
          </button>
          <div className="mt-2 text-right">
            <Link href="/auth/signup" className="text-sm text-[#00BD6B] hover:underline">
            Doesn't have an account ? Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
