"use client";

import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = React.useState<{ name: string; email: string; role: string; isAdmin: boolean; isVerified: boolean } | null>(null);

  const fetchUserData = async () => {
    try {
      const response = axios.get("/api/users/me");

      toast.promise(response, {
        loading: "Fetching user data...",
        success: (data: any) => {
          if (data.data.success) {
            setUser(data.data.data);
            console.log(data.data.data);
            return data.data.message;
          }
        },
        error: (error: any) => {
          return error.response?.data.message || "Something went wrong!";
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleLogOut = async () => {
    try {
      const response = axios.get("/api/users/logout");

      toast.promise(response, {
        loading: "Logging out...",
        success: (data: any) => {
          if (data.data.success) {
            router.push("/login");
            return data.data.message;
          }
        },
        error: (error: any) => {
          return error.response?.data.message || "Something went wrong!";
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col ralative items-center justify-center h-screen">
      <h1 className="font-bold text-3xl">This is the profile page for the users</h1> 

      <div className="bg-gray-900 p-8 rounded-xl shadow-md w-full max-w-md mt-10">
        <p className="text-white text-xl font-semibold">Name : <span className="text-orange-500 text-2xl font-semibold">{user?.name}</span></p>
        <p className="text-white text-xl font-semibold">Email : <span className="text-orange-500 text-2xl font-semibold">{user?.email}</span></p>
        <p className="text-white text-xl font-semibold">is Admin : <span className="text-orange-500 text-2xl font-semibold">{user?.isAdmin ? "Yes" : "No"}</span></p>
        <p className="text-white text-xl font-semibold">is Verified : <span className="text-orange-500 text-2xl font-semibold">{user?.isVerified ? "Yes" : "No"}</span></p>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-600 mt-10 px-4 py-3 rounded-lg font-semibold text-white"
        onClick={handleLogOut}
      >
        Logout
      </button>
      <Toaster />
    </div>
  );
}
