"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const SignupPage = () => {

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
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

    if (!user.name) {
      newErrors.name = "Name is required.";
    }

    if (!user.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Email format is invalid.";
    }

    if (!user.password) {
      newErrors.password = "Password is required.";
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (user.password !== user.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  // Handle signup form submission
  const onSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({}); // Clear any previous errors

    try {
      const response = await axios.post("/api/users/signup", user);
      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      setSuccess(null);
      setErrors({ general: "An error occurred during signup. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center py-8">
      <h1 className="text-3xl font-bold">Signup Page</h1>

      <form
        onSubmit={onSignup}
        className="w-full max-w-md space-y-4 p-6 border rounded-md shadow-md"
      >
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-lg font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            placeholder="Enter your name"
            onChange={handleInputChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 text-black font-semmiboold "
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

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
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 text-black font-semmiboold "
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 text-black font-semmiboold "
            required
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="block text-lg font-medium mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={user.confirmPassword}
            placeholder="Confirm your password"
            onChange={handleInputChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 text-black font-semmiboold  "
            required
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {errors.general && <p className="text-red-500 text-center">{errors.general}</p>}

        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-full p-3 text-white bg-orange-500 rounded-md cursor-pointer hover:bg-orange-400 ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Signup"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Go to Login
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

export default SignupPage;
