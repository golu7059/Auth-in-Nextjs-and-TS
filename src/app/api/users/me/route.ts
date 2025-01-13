import { NextRequest,NextResponse } from "next/server";
import { tokenData } from "@/helpers/tokenData";

import User from "@/models/usermodel";
import { dbConnection } from "@/dbConfig/dbConfig";

await dbConnection();

export async function GET(request : NextRequest){
    try{
        const data = await tokenData(request);

        if(!data){
            return NextResponse.json({
                status : 401,
                message : "Unauthorized",
                success : false
            });
        }

        const user = await User.findById({_id : data}).select("-password");

        if(!user){
            return NextResponse.json({
                status : 404,
                message : "User not found",
                success : false
            });
        }

        return NextResponse.json({
            status : 200,
            message : "User found",
            success : true,
            data : user
        });
    }
    catch(error : any){
        console.log("error in getting user data in /me backend : ",error.message);
        return NextResponse.json({
            status : 500, 
            message : "server error to find user data",
            success : false
        })
    }
}