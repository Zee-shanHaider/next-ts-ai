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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkUsernameStatus, setCheckUsernameStatus] =
    useState<boolean>(false);
  const [checkedUsernameMessage, setCheckedUsernameMessage] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  //zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const result = new z.ZodError([]);
  console.log(result);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    console.log("submission started");
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (error as AxiosError<ApiResponse>) {
        toast({
          title: "Sign In Error",
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
          <div className="flex flex-col gap-2">
            <div className="text-4xl text-center font-semibold">
              Login your account
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
