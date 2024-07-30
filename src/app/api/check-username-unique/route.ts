import dbConnect from "@/lib/dbConnection";
import UserModel from "@/app/model/User";
import { z } from "zod";
import { usernameValidation } from "@/app/schemas/signupSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
          success: false,
        },
        {
          status: 403,
        }
      );
    }
    const { username } = result.data;
    const existingUser = await UserModel.findOne({
      username: username.toLowerCase(),
      isVerified: true,
    });
    if (existingUser)
      return Response.json(
        {
          message: `Username is already taken`,
          success: false,
        },
        {
          status: 200,
        }
      );
    return Response.json(
      {
        message: `Username is available`,
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return Response.json(
      {
        message: `Error checking username uniqueness: ${error.message}`,
      },
      {
        status: 500,
      }
    );
  }
}
