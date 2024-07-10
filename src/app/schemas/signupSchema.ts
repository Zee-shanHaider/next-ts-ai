import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 6 characters")
  .max(50, "Username must be at least 16 characters")
  .regex(/^[0-9A-Za-z]{6,16}$/, "Username must be of 6 to 16 characters");

export const passwordValidation = z
  .string()
  .regex(
    /^(?=.*?[0-9])(?=.*?[A-Za-z]).{8,32}$/,
    "Password must be 8-32 characters long and include at least one letter and one number."
  );

export const signupSchemaValidation = z.object({
  username: usernameValidation,
  email: z.string().email(),
  password: passwordValidation,
  role: z.string(),
  isEmailVerified: z.string(),
  isAcceptingMessage: z.string(),
  isVerified: z.string(),
  verifyCode: z.string(),
  verifyCodeExpiration: z.string(),
  messages: z.string(),
});
