"use client"

import axios, { AxiosError } from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const sendForgotPasswordToken = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValidEmail(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        try {
            setLoading(true);
            const response: any = axios.post("/api/users/verifyforgotpassword/email", { email });
            toast.promise(response, {
                loading: "Sending email.....",
                success: (data: any) => {
                    return data?.data.message || "Check your email";
                },
                error: (data: any) => {
                    return data.response?.data?.message || "Please try again later";
                },
            });
            setLoading(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError = error;
                toast.error(axiosError.response?.data || "Something went wrong here");
            }
            else {
                console.log(error);
                toast.error("Something went wrong here");
            }
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-950 w-full">
            <form onSubmit={sendForgotPasswordToken} className="flex flex-col items-center justify-center h-1/2 w-1/2 bg-gray-800 p-4 rounded-md">
                <h1 className="text-3xl font-bold">Forgot Password</h1>
                <div className="my-4 flex justify-center items-center gap-5 flex-wrap w-[70%]">
                    <label htmlFor="email" className="font-bold text-base">
                        Email :
                    </label>
                    <input
                        type="text"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-[50%] border-none outline-none focus:ring-2 focus:ring-orange-800 px-3 py-2 rounded-md bg-gray-700 text-white"
                    />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={loading}>
                    Submit
                </button>

                <p className="mt-4 text-orange-600 text-base">
                    we will send you an email to reset your password
                </p>
            </form>
            <Toaster />
        </div>
    );
};

export default ForgotPassword;

