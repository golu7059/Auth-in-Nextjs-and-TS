"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/api/users/verifyemail/?token=${token}`);
        if (response.data.status === 200) {
          setMessage("Email verified successfully!");
        } else {
          setMessage("Invalid or expired token.");
        }
      } catch (error: any) {
        setMessage("An error occurred while verifying your email.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setMessage("No token provided.");
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <Toaster />
      <div className="bg-gray-800 p-8 rounded-md shadow-md w-full max-w-md text-center">
        {loading ? (
          <p className="font-bold text-2xl">Verifying your email...</p>
        ) : (
          <>
            <p className="font-bold text-xl">{message}</p>
              <button
                onClick={() => router.push("/profile")}
                className="mt-4 p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 font-bold text-base"
              >
                Go to Profile
              </button>
          </>
        )}
      </div>
    </div>
  );
}

