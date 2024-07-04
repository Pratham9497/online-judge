"use client"

import React from "react";
import { Menu, MenuItem, ProductItem } from "@/components/ui/NavbarMenu";
import { cn } from "@/utils/cn";
import { useSession } from "next-auth/react";
import {User} from 'next-auth'
import Link from "next/link";
import ProfileToggle from "./ProfileToggle";

export default function Navbar({ className }: { className?: string }) {

  const {data: session, status} = useSession()

  const user = session?.user

  return (
    <div
      className={cn("fixed top-8 inset-x-0 lg:mx-[10%] mx-[5%] z-50", className)}
    >
      <Menu>
        <MenuItem href="/" item="Home" />
        <MenuItem href="/about" item={`About`} />
        <MenuItem href="/problem" item="Problems" />
        <MenuItem href="/contact" item="Contact" />
        { status === "loading" ? <></> :
          session ? (
            <>
              <MenuItem href="/submissions" item="My Submissions" />
              <ProfileToggle username={session.user.username} />
            </>
          ) : (
            <>
              <Link href="/login" className="flex items-center justify-center w-1/4">
                <button className="p-[3px] relative w-28 text-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                  <div className="px-5 py-2  bg-black-200 rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                    Sign In
                  </div>
                </button>
              </Link>
            </>
          )
        }
        
      </Menu>
    </div>
  );
}
