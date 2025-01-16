import { sendMail } from "@/helpers/mailer";
import { NextRequest, NextResponse } from "next/server";

export async function  POST(request : NextRequest){
    try {
        const requestBody = await request.json();
        const {email,type,_id} = requestBody;

        if(!email || !type || !_id){
            return NextResponse.json({
                status : 401,
                message : "Insufficient details to send an email",
                success : false
            })
        }
        const response:any = await sendMail(email,type,_id);
        
        if(response.success){
            return NextResponse.json({
                status : 200,
                message : "email send successfully",
                success : true
            })
        }
        
    } catch (error:any) {
        console.log("Error in sending mail to the user : ", error.message);
        return NextResponse.json({
            status : 500,
            message :" Unable to the email right now !",
            success : false
        })
    }
}