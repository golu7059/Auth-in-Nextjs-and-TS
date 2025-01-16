import { dbConnection } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/usermodel";
import bcryptjs from "bcryptjs";
import { sendMail } from "@/helpers/mailer";

// Establish database connection
await dbConnection();

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json(); // You need to await this

    const { name, email, password } = requestData;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 } // Using 400 for bad request
      );
    }

    // Check if the user already exists by email
    const user = await User.findOne({ email }); // Await this call
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 } // 409 is more appropriate for conflict errors
      );
    }

    // Hash the password before saving
    // const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, 10); // Hash with salt rounds of 10

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // send the verification email to the user 
    await sendMail(savedUser.email,"verify",savedUser._id);
    
    return NextResponse.json({
        message : "user created successfully",
        success : true,
        status : 201,
        savedUser
    })
  } catch (error: any) {
    // Handle any errors that occur during the process
    return NextResponse.json(
      { error: error.message },
      { status: 500 } // Server error
    );
  }
}
