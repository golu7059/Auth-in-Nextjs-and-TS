import User from "@/models/usermodel";
import { NextRequest , NextResponse  } from "next/server";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { dbConnection } from "@/dbConfig/dbConfig";

await dbConnection()

export async function POST(request : NextRequest){
console.log("function called to login the user !")
    const {email , password } = await request.json();
    
    if(!email || !password) {
        NextResponse.json({
            status : 400, 
            message : "All inputs are rquired !",
            success : false 
        })
    }
    try {
        const user = await User.findOne({ email }).select('+password');
        if(!user){
            NextResponse.json({
                status : 400, 
                message : "Invalid email id !",
                success : false 
            })
        }
        const isPasswordVerified  = await bcryptjs.compare(password, user.password);

        if(!isPasswordVerified){
            NextResponse.json({
                status : 400, 
                message : "Invalid password  ",
                success : false 
            })
        }
        const userData = {
            userid : user._id ,
            name : user.name,
            email : user.email,
        }

        const token = await jwt.sign(userData, process.env.SECRET_KEY as string, { expiresIn: "1d" });

        const response = NextResponse.json({
            status: 200,
            message: "login successfully!",
            success: true,
        });
        response.cookies.set("token", token, {
            httpOnly: true,
        });
        return response;
    } catch (error : any){
        console.log(error)
        return NextResponse.json({
            status : 500,
            message : "Please try to login later !",
            success : false 
        })
    }
}