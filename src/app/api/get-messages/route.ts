import dbConnect from "@/lib/dbConnection";
import UserModel from "@/app/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { User, getServerSession } from "next-auth";
import mongoose from "mongoose";

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
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $unwind: "$messages",
      },
      { $sort: { "messages.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);
    if (!user || user.length === 0) {
      return Response.json(
        {
          message: "Failed to find user",
          success: false,
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Failed to get user messages",
        success: false,
      },
      { status: 500 }
    );
  }
}
