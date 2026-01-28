"use client";
import Image from "next/image";
import React, { ReactNode } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Calendar, Search, User } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

const Header = ({ children }: { children: ReactNode }) => {
  return (
    <div className="">
      <div className="bg-[#212529] h-14 md:h-16 flex flex-row items-center justify-between px-4 md:px-5 lg:px-20 xl:px-30 2xl:px-[15vw] sticky top-0 z-50 w-screen">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="./dragon.svg"
            alt="Dragon"
            width={32}
            height={32}
          />
          <h1 className="text-2xl pl-2 text-white hidden md:block">AnimeTrove</h1>
        </Link>

        {/* Mobile Nav - Icons only */}
        <div className="md:hidden flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-primary hover:text-white"
            asChild
          >
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-primary hover:text-white"
            asChild
          >
            <Link href="/calendar">
              <Calendar className="h-5 w-5" />
            </Link>
          </Button>
          <SignedIn>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-primary hover:text-white"
              asChild
            >
              <Link href="/my-anime">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <Button
              className="bg-primary text-primary-foreground hover:bg-white hover:text-primary text-sm px-3"
              asChild
            >
              <SignInButton />
            </Button>
          </SignedOut>
        </div>

        {/* Desktop Nav */}
        <div className="items-center gap-4 hidden md:flex h-full">
          <Button
            className="w-20 text-white hover:bg-primary hover:text-white h-full rounded-none"
            variant="ghost"
            asChild
          >
            <Link href="/search">Search</Link>
          </Button>
          <Button
            className="w-20 text-white hover:bg-primary h-full rounded-none hover:text-white"
            variant="ghost"
            asChild
          >
            <Link href="/calendar">Calendar</Link>
          </Button>
          <SignedOut>
            <Button
              className="w-20 text-white hover:bg-primary h-full rounded-none hover:text-white"
              variant="ghost"
              asChild
            >
              <SignUpButton />
            </Button>
            <Button
              className="w-24 bg-primary text-primary-foreground hover:bg-white hover:text-primary"
              asChild
            >
              <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <Link
              href="/my-anime"
              className="px-4 hover:bg-primary h-full rounded-none flex items-center justify-center"
            >
              <User className="h-5 w-5 text-white" />
            </Link>
          </SignedIn>
        </div>
      </div>
      <div className="px-5 pt-6 pb-10 lg:px-10 xl:px-17 2xl:px-[12vw] w-screen relative">
        {children}
      </div>
    </div>
  );
};

export default Header;
