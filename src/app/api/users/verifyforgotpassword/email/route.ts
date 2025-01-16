import { dbConnection } from "@/dbConfig/dbConfig";
import { sendMail } from "@/helpers/mailer";
import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";

await dbConnection();

export async function POST(request : NextRequest){
    const requestBody = await request.json();
    try {
        const {email} = requestBody;
    if(!email){
        return NextResponse.json({
            status : 401,
            message : "Please provide an email id ",
            success : false
        })
    }

    const user: any = await User.findOne({ email }).select("-password");
    if(!user){
        return NextResponse.json({
            status : 404,
            message : "Invalid email Id",
            success : false
        })
    }

    const type: string = "reset";
    const  _id = user._id.toString();

    const response:any = await sendMail(email, type, _id );
    
    if(response.success){
        return NextResponse.json({
            status : 200,
            message : "email send successfully",
            success : true
        })
    } else {
        return NextResponse.json({
            status : 400,
            message : "Unable to send the email due to type mismatch",
            success : false
        })
    }
    } catch (error:any) {
     console.log("Error in sending the forgot password email validator funciton : ", error?.message);   
     return NextResponse.json({
        status : 500, 
        message :error.message || "Unable to send the email right now !",
        success : false
     })
    }
}