"use client"

import React from "react";
import { Menu, MenuItem, ProductItem } from "@/components/ui/NavbarMenu";
import { cn } from "@/utils/cn";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import ProfileToggle from "./ProfileToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Contact, Home, Info, List, ListChecks, LogIn, LogOut, User } from "lucide-react";
import useWindowSize from "@/hooks/useWindowSize";
import { FaBars} from "react-icons/fa6";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";


export default function Navbar({ className }: { className?: string }) {

  const { data: session, status } = useSession()
  const router = useRouter()

  const windowSize = useWindowSize()

  return (
    <div
      className={cn("fixed top-8 inset-x-0 lg:mx-[10%] mx-[5%] z-50", className)}
    >
      <Menu>
        {!windowSize.width || windowSize.width > 640 ? (
          <>
            <MenuItem href="/" item="Home" />
            <MenuItem href="/about" item={`About`} />
            <MenuItem href="/problem" item="Problems" />
            <MenuItem href="/contact" item="Contact" />
            {status === "loading" ? <></> :
              session ? (
                <>
                  <MenuItem href="/submissions" item="My Submissions" />
                  <ProfileToggle username={session.user.username} />
                </>
              ) : (
                <>
                  <Link href="/login" className="flex items-center justify-center w-1/4 max-md:max-w-24">
                    <button className="md:p-[3px] p-[2px] relative w-28 text-sm">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                      <div className="md:px-5 px-2 md:py-2 py-1 bg-black-200 rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                        Sign In
                      </div>
                    </button>
                  </Link>
                </>
              )
            }
          </>
        ) : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger><Button variant="outline"><FaBars className="text-lg" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent>
                {
                  status === "loading" ? <></> : session ? (
                    <>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Hi <span className="text-purple italic">{session.user.username}</span></DropdownMenuLabel>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => router.push(`/u/${session.user.username}`)}>
                          <User className="mr-2 h-4 w-4" />
                          <span>My Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {signOut()}}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Logout</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </>
                  ) : (
                    <>
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => router.push('/login')}>
                          <LogIn className="mr-2 h-4 w-4" />
                          <span>Sign In</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </>
                  )
                }
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push('/')}>
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/about')}>
                    <Info className="mr-2 h-4 w-4" />
                    <span>About</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/problem')}>
                    <List className="mr-2 h-4 w-4" />
                    <span>Problems</span>
                  </DropdownMenuItem>
                  {
                    status === "loading" ? <></> : (session && (
                      <DropdownMenuItem onClick={() => router.push('/submissions')}>
                        <ListChecks className="mr-2 h-4 w-4" />
                        <span>My Submissions</span>
                      </DropdownMenuItem>
                    ))
                  }
                  <DropdownMenuItem onClick={() => router.push('/contact')}>
                    <Contact className="mr-2 h-4 w-4" />
                    <span>Contact</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
        }
      </Menu>
    </div>
  );
}
