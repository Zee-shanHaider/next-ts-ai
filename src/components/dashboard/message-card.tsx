import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Message } from "@/app/model/User";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Alert from "./alert-card";

type MessageCard = {
  message: Message;
};
export default function CardWithForm({ message }: { message: MessageCard }) {
  const alert = {
    title: "Confirm",
    textContent: "You are about to create a new project.",
  };
  const alertConfirm = (id: string) => {
    console.log("Confirmed alert", id);
  };
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>{message.message.content}</CardDescription>
      </CardHeader>
      {/* <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
          </div>
        </form>
      </CardContent> */}
      <CardFooter className="flex justify-end">
        {/* <Button variant="outline">Cancel</Button> */}
        <Alert alert={alert} alertConfirm={alertConfirm} />
      </CardFooter>
    </Card>
  );
}
