import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// grab the token data from the request
export const tokenData = async (req: NextRequest) => {
    try {
        const token = req.cookies?.get("token")?.value || "";

        if (!token) {
            throw new Error("Token not found");
        }

        if (!process.env.SECRET_KEY) {
            throw new Error("SECRET_KEY environment variable is not set");
        }
        // extracting the data from the token using jwt.verify
        const data = await jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload;
        return (data as jwt.JwtPayload).userid as string;

    } catch (error: any) {
        console.error("Error verifying token:", error.message);
        return null;
    }
}