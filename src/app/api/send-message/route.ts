import UserModel from "@/app/model/User";
import dbConnect from "@/lib/dbConnection";
import { Message } from "@/app/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({
      username,
    });
    if (!user) {
      return Response.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          message: "User is not accepting messages",
          success: false,
        },
        { status: 500 }
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        message: "Message sent successfully",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Failed to send the message",
        success: false,
      },
      { status: 500 }
    );
  }
}
