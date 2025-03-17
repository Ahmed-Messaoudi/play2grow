'use client'
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import emailIcon from "@/public/email.svg";
import passwordIcon from "@/public/password.svg";
import userIcon from "@/public/user.svg";
import phoneIcon from "@/public/phone.svg";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Signing up with:", formData);
    // Handle sign-up logic
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white text-black">
      <div>
        <Image src={logo} alt="Logo" width={400} height={100} />
      </div>
      <h2 className="mb-6 text-center text-2xl font-semibold font-[jua] text-gray-700">
        Create your account
      </h2>
      <div className="w-full max-w-md border rounded-lg border-gray-300 bg-white p-8 shadow-md">
        <form onSubmit={handleSubmit}>
          
          {/* Full Name */}
          <div className="mb-4">
            <div className="flex items-center pb-2">
              <Image src={userIcon} alt="Full Name" width={20} height={20} />
              <label className="ml-2 block text-sm font-semibold text-gray-600">
                Full Name
              </label>
            </div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <div className="flex items-center pb-2">
              <Image src={emailIcon} alt="Email" width={20} height={20} />
              <label className="ml-2 block text-sm font-semibold text-gray-600">
                Email
              </label>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <div className="flex items-center pb-2">
              <Image src={phoneIcon} alt="Phone" width={20} height={20} />
              <label className="ml-2 block text-sm font-semibold text-gray-600">
                Phone Number
              </label>
            </div>
            <input
  type="tel"
  name="phone"
  value={formData.phone}
  onChange={handleChange}
  pattern="[0-9]*"
  inputMode="numeric"
  onKeyPress={(e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }}
  className="w-full p-2 border rounded-md focus:border-blue-500 focus:outline-none"
  required
/>
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="flex items-center pb-2">
              <Image src={passwordIcon} alt="Password" width={20} height={20} />
              <label className="ml-2 block text-sm font-semibold text-gray-600">
                Password
              </label>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <div className="flex items-center pb-2">
              <Image src={passwordIcon} alt="Confirm Password" width={20} height={20} />
              <label className="ml-2 block text-sm font-semibold text-gray-600">
                Confirm Password
              </label>
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-gradient-to-r from-[#0090FF] to-[#00FF94] hover:from-[#00FF94] hover:to-[#0090FF] transition-all px-4 py-2 text-white font-semibold"
          >
            Sign Up
          </button>

          {/* Sign In Link */}
          <div className="mt-4 text-center">
            <Link href="/auth/login" className="text-sm text-[#00BD6B] hover:underline">
              Already have an account? Sign in
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SignUp;
