"use client"

import axios, { AxiosError } from "axios";
import { use, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { set } from "mongoose";


export default function EnterNewPassword(){
    const searchParams = useSearchParams();
    const router = useRouter();
    const [password , setPassword] = useState<string>("");
    const [confirmPassword , setConfirmPassword] = useState<string>("");
    const[email, setEmail] = useState<string>("");
    const[success, setSuccess] = useState<boolean>(false);
    const[time,setTime] = useState<number>(5);


    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.name === "password"){
            setPassword(e.target.value);
        }
        if(e.target.name === "confirmpassword"){
            setConfirmPassword(e.target.value);
        }
    }

    const handleSubmit = async (e : React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(password !== confirmPassword){
            toast.error("Password and Confirm Password do not match");
            return;
        }
        try {
            const response = axios.post("/api/users/verifyforgotpassword/newpassword", { email,newPassword : password });
            toast.promise(response, {
                loading : "Setting new password.....",
                success : (data:any) => {
                    if(data?.data?.success){
                        setSuccess(true);
                    }
                    return  (data?.data?.message) || "Check your email"
                },
                error : (data:any) => {
                    return data?.data?.message || "Please try again later"
                }
            })
        } catch (error) {
            if(axios.isAxiosError(error)){
                const axiosError : AxiosError = error;
                toast.error(axiosError.response?.data || "Something went wrong to change password");
            } else {
                console.log("Error in changing the password : ", error);
                return;
            }
        }
    }
    const isValidToken = async() => {
        try {
            const token = searchParams.get("token");

            const response:any = await axios.post(`/api/users/verifyforgotpassword/?token=${token}`);
            setEmail(response?.data?.data?.email);
        } catch (error) {
            if(axios.isAxiosError(error)){
                const axiosError : AxiosError = error;
                toast.error(axiosError.response?.data || "Something went wrong here");
            } else {
                console.log("Error in verifying the token : ", error);
                return;
            }
        }
    }

    // start a timer to redirect the user to login page after success 
    useEffect(() => {
        if(success){
            const interval = setInterval(() => {
                setTime((prevtime) => {
                    if(prevtime <= 1){
                        clearInterval(interval);
                        router.push("/login");
                        return prevtime;
                    }
                    return prevtime-1;
                })
            },1000);
            return () => clearInterval(interval);
        }
    },[success])

    // check for the token is valid for not 
    useEffect(() => {
        isValidToken();
    },[])
    return (
        <div className="h-sc flex items-center justify-center h-screen w-screen bg-gray-950 text-white">
            {email && !success &&
            (
                <form action="" className="h-1/2 w-[35%] rounded-lg flex items-center flex-col justify-around bg-gray-800 ">
                <h1 className="font-bold text-3xl ">Enter New Password</h1>
                <div className="flex flex-col gap-6 w-[90%]">
                <div className="flex justify-between text-center">
                        <label htmlFor="password"
                        className="font-semibold text-base"
                        >Password : </label>
                        <input type="text" 
                        className="w-[58%] text-black px-3 py-2 outline:none rounded-md focus:ring-2 focus:ring-orange-500 border-none"
                        id="password"
                        name="password"
                        onChange={handleChange}
                        />
                    </div>
                    <div className="flex justify-between gap-7 text-center">
                        <label htmlFor="confirmPassword"
                        className="font-semibold text-base"
                        >Confirm Password :</label>
                        <input type="text" 
                        name="confirmpassword"
                        id="confirmPassword"
                        className="w-[58%] text-black px-3 py-2 outline:none rounded-md focus:ring-2 focus:ring-orange-500 border-none"
                        onChange={handleChange}
                        />
                    </div>
                    
                </div>
                    <button className="py-3 px-6 rounded-sm font-semibold bg-orange-600 hover:bg-orange-500 transition duration-300"
                    type="submit"
                    onClick={handleSubmit}
                    >submit</button>
                </form>
            )}

            {!email && (
                <div className="w-1/3 h-1/2 flex flex-col gap-6 items-center justify-center bg-gray-800 rounded-lg">
                    <h1 className="font-bold text-2xl">Token is not valid, please try again</h1>
                    <button 
                    className="py-3 px-6 rounded-sm font-semibold bg-orange-600 hover:bg-orange-500 transition duration-300"
                    onClick={() => router.push("/login")} 
                    >Login page</button>
                </div>
            )}
            {success && (
                <div className="w-1/3 h-1/2 flex flex-col gap-6 items-center justify-center bg-gray-800 rounded-lg">
                    <h1 className="font-bold text-2xl">Password changed successfully</h1>
                    <h6>you will be redirected to the login page in <span className="font-bold text-orange-500 text-xl">{time}</span> seconds</h6>
                    <button 
                    className="py-3 px-6 rounded-sm font-semibold bg-orange-600 hover:bg-orange-500 transition duration-300"
                    onClick={() => router.push("/login")} 
                    >Go to Login page</button>
                </div>
            )}
            <Toaster />
        </div>
    )
}
