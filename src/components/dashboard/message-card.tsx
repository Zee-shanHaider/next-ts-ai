import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Message } from "@/app/model/User";

import Alert from "./alert-card";

type MessageCard = {
  message: Message;
};
export default function MessageCard({
  message,
  onDeleteMessage,
}: {
  message: Message;
  onDeleteMessage: (id: string) => void;
}) {
  const alert = {
    title: "Delete",
    textContent: "You are about to delete this message.",
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Message</CardTitle>
        <CardDescription>{message.content}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Alert
          alert={alert}
          alertConfirm={() => onDeleteMessage(message._id as string)}
        />
      </CardFooter>
    </Card>
  );
}
