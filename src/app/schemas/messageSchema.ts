import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(6, "Message content should be at least of min 6 characters long")
    .max(300, "Message content should be at least of max 300 characters long"),
});
