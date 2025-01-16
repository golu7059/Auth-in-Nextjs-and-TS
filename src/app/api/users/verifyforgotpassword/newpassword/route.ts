import { NextRequest, NextResponse } from "next/server";
import { dbConnection } from "@/dbConfig/dbConfig";
import User from "@/models/usermodel";
import bcryptjs from "bcryptjs"

await dbConnection();

export async function POST(req: NextRequest) {
    try {
        const requestBody = await req.json();
        const { email, newPassword } = requestBody;

        if (!email) {
            return NextResponse.json({
                status: 400,
                message: "Please provide an email id",
                success: false
            })
        }

        if (!newPassword) {
            return NextResponse.json({
                status: 400,
                message: "Please provide a new password",
                success: false
            })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({
                status: 404,
                message: "User not found",
                success: false
            })
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({
            status: 200,
            message: "Password updated successfully",
            success: true
        })

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            status: 500,
            message: "Unable to update password right now !",
            success: false
        })
    }
}