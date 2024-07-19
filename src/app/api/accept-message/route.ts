import dbConnect from "@/lib/dbConnection";
import UserModel from "@/app/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { User, getServerSession } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user)
    return Response.json(
      {
        message: "Not Authenticated",
        success: false,
      },
      { status: 401 }
    );
  const userId = user?._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true } // it returns the updated value of user
    );
    if (!updatedUser)
      return Response.json(
        {
          message: "Failed to updated user status to accept messages",
          success: false,
        },
        { status: 401 }
      );
    if (updatedUser)
      return Response.json(
        {
          message: "Message acceptance status updated successfully",
          success: true,
          updatedUser,
        },
        { status: 201 }
      );
  } catch (error) {
    return Response.json(
      {
        message: "Failed to updated user status to accept messages",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user)
    return Response.json(
      {
        message: "Not Authenticated",
        success: false,
      },
      { status: 401 }
    );
  const userId = user?._id;
  try {
    const findUser = await UserModel.findById(userId);
    if (!findUser)
      return Response.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    if (findUser)
      return Response.json(
        {
          isAcceptingMessages: findUser.isAcceptingMessage,
          success: true,
        },
        { status: 200 }
      );
  } catch (error) {
    return Response.json(
      {
        message: "Error in getting message acceptance status",
        success: false,
      },
      { status: 500 }
    );
  }
}
