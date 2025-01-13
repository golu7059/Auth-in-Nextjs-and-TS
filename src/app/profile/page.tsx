"use client"

import { useRouter } from "next/navigation";
import Link from "next/link";
import { tokenData } from "@/helpers/tokenData";

const profilePage = () => {
    const router = useRouter();
    
    return (
        <div className="flex flex-col ralative items-center justify-center h-screen">
            <h1 className="font-bold text-3xl">This is the profile page for the users</h1>
           <Link href="/profile/me">
           <button 
                className="bg-blue-500 hover:bg-blue-700 mt-10 font-bold py-2 px-4 rounded text-gray-300"
                >
            get profile    
            </button> 
           </Link> 
        </div>
    )
}

export default profilePage;
