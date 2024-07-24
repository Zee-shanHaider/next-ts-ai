"use client";
import { useDebounceValue } from "usehooks-ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@react-email/components";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { signupSchemaValidation } from "@/app/schemas/signupSchema";
import { ApiResponse } from "@/types/ApiResponse";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function Component() {
  return <h2>This is form.</h2>;
}

export const ToastDemo = () => {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Dushed",
        });
      }}
    >
      Show Toast
    </Button>
  );
};
