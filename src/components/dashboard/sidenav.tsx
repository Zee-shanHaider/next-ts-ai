"use client";

import Link from "next/link";
import NavLinks from "./nav-links";
import Image from "next/image";
import Logo from "./dashboard-logo.png";
import { PowerIcon } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

export default function SideNav() {
  const router = useRouter();
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <Image
            src={Logo}
            alt="Logo"
            width={160}
            height={64}
            className="w-full"
          />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks username={user?.username as string} />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        {session ? (
          <>
            <span>Welcome, {user?.username || user?.email}</span>
            <button
              onClick={async () => {
                await signOut();
              }}
              className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            >
              <PowerIcon className="w-6" />
              <div className="hidden md:block">Sign Out</div>
            </button>
          </>
        ) : (
          <Button variant="link" onClick={() => router.replace("/sign-in")}>
            Sign in
          </Button>
        )}
      </div>
    </div>
  );
}
