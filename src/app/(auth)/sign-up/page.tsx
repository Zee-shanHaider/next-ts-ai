"use client";
import { useDebounceValue } from "usehooks-ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { signupSchema } from "@/app/schemas/signupSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

export default function Component() {
  const [debouncedValue, setValue] = useDebounceValue("", 500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkUsernameStatus, setCheckUsernameStatus] =
    useState<boolean>(false);
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);
  const [checkedUsernameMessage, setCheckedUsernameMessage] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  //zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      setIsUsernameChecking(true);
      setCheckedUsernameMessage("");
      try {
        // Replace this with your actual API call or logic to check the username
        const response = await axios.get(
          `/api/check-username-unique?username=${debouncedValue}`
        );
        const data = response.data;
        if (data) {
          setCheckedUsernameMessage(data?.message);
          setCheckUsernameStatus(data?.success);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (error as AxiosError<ApiResponse>) {
          setCheckedUsernameMessage(
            axiosError?.response?.data.message ?? "Error checking username"
          );
          setCheckUsernameStatus(axiosError?.response?.data.success ?? false);
        } else {
          setCheckedUsernameMessage("An unexpected error occurred");
        }
      } finally {
        setIsUsernameChecking(false);
      }
    };
    if (debouncedValue) {
      checkUsername();
    }
  }, [debouncedValue]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        setIsSubmitting(false);
        router.replace(`/verify/${debouncedValue}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (error as AxiosError<ApiResponse>) {
        toast({
          title: "Sign Up Error",
          description: axiosError?.response?.data.message ?? "Sign Up Failed",
          variant: "destructive",
        });
      } else {
        setCheckedUsernameMessage("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <div className="flex p-3 flex-col gap-2">
            <div className="text-4xl text-center font-extrabold">
              JOIN MYSTERY MESSAGES
            </div>
            <div className="text-sm text-center font-normal">
              Signup to start your anynomous adventure
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="shadcn"
                        {...field}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        onChange={(event) => {
                          field.onChange(event);
                          setValue(event.target.value);
                        }}
                      />
                    </FormControl>
                    {isUsernameChecking && <Loader2 className="animate-spin" />}
                    {checkedUsernameMessage && (
                      <div
                        className={`${
                          checkUsernameStatus
                            ? "text-green-400"
                            : "text-red-400"
                        } text-sm`}
                      >
                        {checkedUsernameMessage}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="abc@test.com"
                        {...field}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none- focus:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="**********"
                        {...field}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Button disabled={isSubmitting} variant="default" type="submit">
                  Submit
                </Button>
              )}
            </form>
          </Form>
          <div className="text-center text-sm">
            Already a member?
            <Button variant="link" className="text-blue-400 p-2">
              Signup
            </Button>{" "}
          </div>
        </div>
      </div>
    </>
  );
}
