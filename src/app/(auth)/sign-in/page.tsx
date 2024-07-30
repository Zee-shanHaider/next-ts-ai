"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiResponse, catchError } from "@/types/ApiResponse";
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
import { signIn } from "next-auth/react";
import { signInSchema } from "@/app/schemas/signInSchema";
import { LoginFormFieldConfig } from "@/types/signInForm";

export default function Component() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        toast({
          title: "Sign In Error",
          description: result?.error ?? "Sign In Failed",
          variant: "destructive",
        });
      }
      if (result?.url) router.replace("/dashboard");
    } catch (error: catchError) {
      toast({
        title: "Sign In Error",
        description: error?.message ?? "Sign Up Failed",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields: LoginFormFieldConfig[] = [
    {
      name: "identifier",
      label: "Email/Username",
      type: "text",
      placeholder: "abc@test.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "**********",
    },
  ];

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col p-3 gap-4">
            <div className="text-4xl text-center font-extrabold">
              JOIN MYSTERY MESSAGES
            </div>
            <div className="text-sm text-center font-normal">
              Signin to your anynomous adventure
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {formFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          {...formField}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
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
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
