import dbConnect from "@/lib/dbConnection";
import UserModel from "@/app/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUser)
      return Response.json(
        {
          message: "username is already taken",
          success: false,
        },
        {
          status: 400,
        }
      );
    const existingUserByEmail = await UserModel.findOne({
      email,
    });
    const verifyCode = Math.floor(1000000 + Math.random() * 900000).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified)
        return Response.json(
          {
            success: false,
            message: "User already exist with email",
          },
          {
            status: 400,
          }
        );
      else {
        const hashedPassword = await bcrypt.hash(password, 32);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiration = new Date(
          Date.now() + 360000
        );
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 32);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const user = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        role: "User",
        isEmailVerified: false,
        isAcceptingMessage: false,
        isVerified: false,
        verifyCodeExpiration: expiryDate,
        messages: [],
      });
      await user.save();
    }
    const sendingEmail = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!sendingEmail.success)
      return Response.json(
        {
          success: false,
          message: sendingEmail.message,
        },
        {
          status: 500,
        }
      );
    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: `Error registering user`,
      },
      {
        status: 500,
      }
    );
  }
}
