"use client";
import Image from "next/image";
import React, { ReactNode } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Calendar, Search } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";

const Header = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();

  return (
    <div className="">
      <div className="bg-[#212529] h-14 md:h-16 flex flex-row items-center justify-between px-4 md:px-5 lg:px-20 xl:px-30 2xl:px-[15vw] sticky top-0 z-50 w-screen">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="./dragon.svg"
            alt="Dragon"
            width={32}
            height={32}
            className="group-hover:scale-105 transition-transform duration-200"
          />
          <h1 className="text-2xl pl-2 text-white hidden md:block group-hover:text-primary transition-colors duration-200">AnimeTrove</h1>
        </Link>

        {/* Mobile Nav - Icons only */}
        <div className="md:hidden flex items-center gap-1">
          <Link
            href="/search"
            className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 active:bg-white/20 transition-all duration-200"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/calendar"
            className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 active:bg-white/20 transition-all duration-200"
          >
            <Calendar className="h-5 w-5" />
          </Link>
          <SignedIn>
            <Link href="/my-anime" className="ml-1">
              <img
                src={user?.imageUrl}
                alt={user?.fullName || "Profile"}
                className="h-8 w-8 rounded-full object-cover hover:ring-2 hover:ring-primary transition-all"
              />
            </Link>
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
        <div className="items-center gap-2 hidden md:flex h-full">
          <Link
            href="/search"
            className="group flex items-center gap-2 px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <Search className="h-4 w-4 group-hover:text-primary transition-colors duration-200" />
            <span>Search</span>
          </Link>
          <Link
            href="/calendar"
            className="group flex items-center gap-2 px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <Calendar className="h-4 w-4 group-hover:text-primary transition-colors duration-200" />
            <span>Calendar</span>
          </Link>
          <SignedOut>
            <Button
              className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              variant="ghost"
              asChild
            >
              <SignUpButton />
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/80 transition-all duration-200"
              asChild
            >
              <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <Link
              href="/my-anime"
              className="ml-2 p-1 rounded-full hover:bg-white/10 transition-all duration-200"
            >
              <img
                src={user?.imageUrl}
                alt={user?.fullName || "Profile"}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-transparent hover:ring-primary transition-all duration-200"
              />
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
