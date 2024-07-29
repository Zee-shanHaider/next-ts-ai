import dbConnect from "@/lib/dbConnection";
import UserModel from "@/app/model/User";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User, getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const messageId = params.messageId;
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
    const user = await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        $pull: { messages: { _id: messageId } },
      }
    );
    if (user.modifiedCount === 0) {
      return Response.json(
        {
          message: "Message not found or deleted already",
          success: false,
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        messages: "Message deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Error while deleting message",
        success: false,
      },
      { status: 500 }
    );
  }
}
