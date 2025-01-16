import { dbConnection } from "@/dbConfig/dbConfig";
import { NextRequest,NextResponse } from "next/server";
import User from "@/models/usermodel";

await dbConnection()

export async function GET(request : NextRequest){
    try {
        const { searchParams } = new URL(request.url); // get the information from the url
        const token = searchParams.get('token');    // extracting the token from the url
        const user = await User.findOne({verifyToken:token,verifyTokenExpiry : {$gt:Date.now()}}).select('-password') // making sure that token not expired
        if(!user){
            return NextResponse.json({
                status : 400,
                error : 'Invalid token or Expired'
            })
        }
        user.isVerified  = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            status : 200,
            message : "Email verified successfully"
        })
    } catch (error:any) {
        console.log("Error in verify : ", error.message);
        return NextResponse.json({
            status : 500,
            message : error.message || "unable to send verify email right now !"
        })
    }
}