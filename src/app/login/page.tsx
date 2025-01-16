"use client";

import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";


import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleLogin = async (user: any) => {
    if (!user.email || !user.password) {
      return toast.error("Please fill all the fields");
    }

    try {
      setLoading(true);

      const response = axios.post("/api/users/login", user);
      toast.promise(response, {
        loading: "Logging in...",
        success: (data: any) => {
          console.log(data);
          if (data.data.success) {
            router.push("/profile");
            return data.data.message;
          } else {
            toast.error(data.data.message);
          }
        },
        error: (error: any) => {
          console.error("Error in login inside toast promise:", error.message);
          return error.response?.data.message || "Something went wrong!";
        }
      })
    } catch (error: any) {
      console.error("Error in login:", error.message);
      toast.error(error.response?.data.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="bg-gray-200 p-8 rounded shadow-md w-full max-w-md">
          <h1 className="font-bold text-orange-500 text-3xl mb-4 text-center">Login</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(user);
            }}
            className="flex flex-col space-y-4 text-black"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleUserInput}
              className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleUserInput}
                className="p-3 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaRegEyeSlash className="text-black" /> : <FaRegEye className="text-black" />}
              </div>
            </div>
            <button
              type="submit"
              className="p-3 bg-orange-500 font-semibold text-white rounded hover:bg-orange-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className=" top-4 w-full">
            <p className="text-black text-center mt-4">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-red-500 hover:underline"
              >
                Register
              </a>
            </p>
          </div>
          <div className=" top-4 w-full text-center font-base">
              <a
                href="/forgotpassword"
                className="text-blue-500 hover:underline"
              >
                Forgot Password
              </a>
          </div>
        </div>
      </div>
    </>
  );
}
