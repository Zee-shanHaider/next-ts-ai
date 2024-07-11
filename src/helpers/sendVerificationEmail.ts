import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { Verification } from "next/dist/lib/metadata/types/metadata-types";

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification email",
      react: VerificationEmail({ username, otp }),
    });
    return {
      success: true,
      message: "Failed to send verification email",
    };
  } catch (error) {
    console.log("Email Failed", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
