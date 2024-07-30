"use client";
import { Message } from "@/app/model/User";
import { AcceptMessageSchema } from "@/app/schemas/acceptSchema";
import MessageCard from "@/components/dashboard/message-card";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse, catchError } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { User } from "next-auth";

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const { username } = (session?.user as User) || "";
  const baseurl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseurl}/u/${username}`;
  const copyUrl = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied",
      description: "Your profile URL has been copied to your clipboard",
      variant: "default",
    });
  };
  const handleDeleteMessage = useCallback(
    async (messageId: string) => {
      try {
        setIsLoading(true);
        const response = await axios.delete(`/api/delete-message/${messageId}`);
        if (response.data.success) {
          toast({
            title: "Message deleted",
            description: "Your message has been deleted successfully",
            variant: "default",
          });
          setMessages(messages.filter((m) => m._id !== messageId));
        } else {
          toast({
            title: "Error deleting message",
            description: response.data.message,
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error deleting message",
          description: error?.message ?? "Failed to delete message",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [messages, toast]
  );

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error fetching messages",
        description:
          axiosError?.response?.data?.message ?? "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchAllMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get<ApiResponse<Message[]>>(
          "/api/get-messages"
        );
        setMessages(response.data.messages);
        if (refresh) {
          toast({
            title: "Messages refreshed",
            description: "Your messages have been refreshed successfully",
            variant: "default",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error fetching messages",
          description:
            axiosError?.response?.data?.message ?? "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessages();
    fetchAllMessages();
  }, [session, fetchAcceptMessages, fetchAllMessages, setValue]);

  const handleSwitchChange = async () => {
    try {
      await axios.put<ApiResponse>("/api/accept-message", {
        isAcceptingMessage: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: acceptMessages ? "Messages stopped" : "Messages started",
        description: "Your messages have been switched successfully",
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error switching messages",
        description:
          axiosError?.response?.data?.message ?? "Failed to switch messages",
        variant: "destructive",
      });
    }
  };

  if (!session || !session.user) return <h2>Please Login</h2>;

  return (
    <>
      <div className="my-6 mx-3 w-full lg:mx-auto p-4 max-w-6xl bg-white">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
        <div className="mb-4 flex gap-2 items-center justify-between w-full">
          <h2 className="font-semibold">Copy Your Unique Link</h2>
          <Input
            type="text"
            className="w-3/4 rounded-lg outline-none focus:ring-0"
            disabled={true}
            value={profileUrl}
          ></Input>
          <Button onClick={() => copyUrl()}>Copy </Button>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            id="accept-messages"
          ></Switch>
          <span className="font-semibold text-md">
            {acceptMessages ? "On" : "Off"}
          </span>
        </div>
        {isLoading && messages.length > 0 && (
          <div className="w-full flex items-center justify-center h-24 mx-auto text-center text-gray-500">
            <Loader2 className="animate-spin w-24 h-24" />
          </div>
        )}
        {messages.length > 0 ? (
          <div className="mt-4 grid md:grid-cols-3 gap-4 grid-cols-1">
            {messages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onDeleteMessage={handleDeleteMessage}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No messages found. Start sending messages now!
          </div>
        )}
      </div>
    </>
  );
}
