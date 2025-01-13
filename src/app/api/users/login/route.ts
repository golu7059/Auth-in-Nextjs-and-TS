import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConnection } from "@/dbConfig/dbConfig";

await dbConnection();

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
        return NextResponse.json({
            status: 400,
            message: "All inputs are required!",
            success: false,
        });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return NextResponse.json({
                status: 400,
                message: "Invalid email ID!",
                success: false,
            });
        }

        // Verify password
        const isPasswordVerified = await bcryptjs.compare(password, user.password);

        if (!isPasswordVerified) {
            return NextResponse.json({
                status: 400,
                message: "Invalid password!",
                success: false,
            });
        }

        // Create token
        const userData = {
            userid: user._id,
            name: user.name,
            email: user.email,
        };
        const token = await jwt.sign(userData, process.env.SECRET_KEY!, {
            expiresIn: "1d",
        });

        // Set cookie and send response
        const response = NextResponse.json({
            status: 200,
            message: "Login successful!",
            success: true,
        });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set to true in production
        });

        return response;
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: "Please try to login later!",
            success: false,
        });
    }
}
