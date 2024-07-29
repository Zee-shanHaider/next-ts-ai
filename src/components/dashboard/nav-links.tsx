"use client";
import { UserIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import React from "react";

// Map of links to display in the side navigation.

export default function NavLinks({ username }: { username: string }) {
  const pathname = usePathname();
  const links = [
    { name: "Home", href: "/dashboard", icon: HomeIcon },
    { name: "Messages", href: `/dashboard/u/${username}`, icon: UserIcon },
    // { name: "Customers", href: "/dashboard/customers", icon: UserIcon },
  ];

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
