import { Message } from "@/app/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}

export type catchError = {
  message?: string;
};
