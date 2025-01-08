"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"
import axios from "axios";

const LoginPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [disabledButton, setDissabledButton] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  // Handle input changes and update state
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  // Validate inputs
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!user.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Email format is invalid.";
    }

    if (!user.password) {
      newErrors.password = "Password is required.";
    }

    return newErrors;
  };

  // Handle login form submission
  const onLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setDissabledButton(true)

    setErrors({}); // Clear any previous errors
    try {
      const response = await axios.post("/api/users/login", user); 
      
      if(!response.data.success){
        setErrors({
          userDetails : "unable to get the user detais",
        })
        return
      }
      setSuccess("Login successful! Redirecting...");
      toast.success("Login successfull")
      const userid  = response.data.userid;
      setTimeout(() => {
        router.push(`/profile/${userid}`); // Or wherever you want to redirect after login
      }, 2000);
    } catch (error) {
      setSuccess(null);
      setErrors({ general: "Invalid credentials. Please try again." });
    } finally {
      setLoading(false);
      setDissabledButton(false)
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center py-8">
      <h1 className="text-3xl font-bold">Login Page</h1>

      <form
        onSubmit={onLogin}
        className="w-full max-w-md space-y-4 p-6 border rounded-md shadow-md"
      >
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-lg font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            placeholder="Enter your email"
            onChange={handleInputChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 text-black font-semibold"
            required
            disabled={disabledButton}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-lg font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            placeholder="Enter your password"
            onChange={handleInputChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 text-black font-semibold"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {errors.general && (
          <p className="text-red-500 text-center">{errors.general}</p>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-full p-3 text-white bg-blue-500 rounded-md cursor-pointer hover:bg-blue-400 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Go to Signup
          </Link>
        </p>
      </div>

      {success && (
        <div className="mt-4 text-green-500 text-center">
          <p>{success}</p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
