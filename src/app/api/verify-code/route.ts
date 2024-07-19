import dbConnect from "@/lib/dbConnection";
import UserModel from "@/app/model/User";
import { z } from "zod";
import { verifySchema } from "@/app/schemas/verifySchema";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const decodedCode = decodeURIComponent(code);
    const user = await UserModel.findOne({
      username: decodedUsername,
    });
    if (!user)
      return Response.json(
        {
          message: `User not found`,
          success: false,
        },
        {
          status: 404,
        }
      );
    const isCodeValid = decodedCode === user.verifyCode;
    const isCodeNotExpired = new Date(user.verifyCodeExpiration) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          message: "Account verified successfully",
          success: true,
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: `Verify code is expired. Please signup agains`,
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          message: `Incorrect verification code`,
          success: false,
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    return Response.json(
      {
        message: `Error verifying user`,
      },
      {
        status: 500,
      }
    );
  }
}
