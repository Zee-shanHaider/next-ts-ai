"use client";
import { useParams } from "next/navigation";
import MessageCard from "@/components/dashboard/message-card";
export default async function Page() {
  const { username } = useParams<{ username: string }>();
  return (
    <>
      <h2>{username}</h2>
      <MessageCard />
    </>
  );
}
