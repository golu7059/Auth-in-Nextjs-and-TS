// function to verify the already sent mail to the user

import { NextRequest, NextResponse } from "next/server"
import User from "@/models/usermodel";
import { dbConnection } from "@/dbConfig/dbConfig";

await dbConnection();

export async function POST (req: NextRequest) {
    const searchParams = new URL(req.url).searchParams;

    try {
        const token = searchParams.get('token');
        if(!token){
            return NextResponse.json({
                status : 400,
                message : "Token not found",
                success : false
            })
        }

        const user = await User.findOne({
            forgotPasswordToken : token,
            forgotPasswordTokenExpiry : {$gt : Date.now()}
        }).select('-password');

        if(!user){
            return NextResponse.json({
                status : 400,
                message : "Invalid or expired token",
                success : false
            })
        }

        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;

        await user.save();
        
        return NextResponse.json({
            status : 200,
            message : "Token verified successfully",
            success : true,
            data : user
        })
        
    } catch (error:Error | any) {
        console.log("Error in verifying forgot password token ", error)
        return NextResponse.json({
            status : 500,
            message : error.message || "Unable to verify forgot password token", 
            success : false
        })
    }
}
