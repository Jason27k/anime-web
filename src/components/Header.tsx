"use client";
import Image from "next/image";
import React, { ReactNode } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Calendar, Heart, LogIn, Menu, Search, UserPen } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

const Header = ({ children }: { children: ReactNode }) => {
  return (
    <div className="">
      <div className="bg-[#212529] h-16 flex flex-row xs:flex-row items-center justify-between px-5 lg:px-20 xl:px-30 2xl:px-[15vw] sticky top-0 z-50 w-screen">
        <Link href="/" className="flex items-center justify-between">
          <Image
            src="./dragon.svg"
            alt="Dragon"
            width={32}
            height={32}
            className="hidden min-[395px]:block"
          />
          <h1 className="text-2xl pl-2 text-white">AnimeTrove</h1>
        </Link>
        <div className="md:hidden flex gap-3">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <Sheet>
            <Button
              className="bg-[#D67900] hover:bg-white hover:text-[#D67900]"
              asChild
            >
              <SheetTrigger>
                <Menu size={24} />
              </SheetTrigger>
            </Button>
            <SheetContent className="bg-[#141414] border-0 max-w-80 md:hidden">
              <SheetHeader>
                <SheetTitle className="text-white text-2xl text-center pt-4">
                  AnimeTrove
                </SheetTitle>
                <SheetDescription className="flex flex-col items-end gap-2 text-white">
                  <SheetClose asChild>
                    <Link
                      href="/search"
                      className="flex gap-2 hover:text-[#D67900]"
                    >
                      <Search size={24} />
                      <span className="text-lg">Search</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/my-anime"
                      className="flex gap-2 hover:text-[#D67900]"
                    >
                      <Heart size={24} />
                      <span className="text-lg">My Anime</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/calendar"
                      className="flex gap-2 hover:text-[#D67900]"
                    >
                      <Calendar size={24} />
                      <span className="text-lg">Calendar</span>
                    </Link>
                  </SheetClose>
                  <SignedOut>
                    <SheetClose asChild>
                      <Link
                        href="/sign-up"
                        className="flex gap-2 text-lg hover:text-[#D67900]"
                      >
                        <UserPen size={24} />
                        <SignUpButton />
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        className="w-24 bg-[#D67900] text-lg hover:bg-white hover:text-[#D67900]"
                        asChild
                      >
                        <div className="">
                          <SignInButton />
                        </div>
                      </Button>
                    </SheetClose>
                  </SignedOut>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
        <div className="items-center gap-4 hidden md:flex h-full">
          <Button
            className="w-20 text-white hover:bg-[#d67900] hover:text-white h-full rounded-none"
            variant={"ghost"}
            asChild
          >
            <Link href="/search">Search</Link>
          </Button>
          <Button
            className="w-20 text-white hover:bg-[#d67900] h-full rounded-none hover:text-white"
            variant={"ghost"}
            asChild
          >
            <Link href="/my-anime">My Anime</Link>
          </Button>
          <Button
            className="w-20 text-white hover:bg-[#d67900] h-full rounded-none hover:text-white"
            variant={"ghost"}
            asChild
          >
            <Link href="/calendar">Calendar</Link>
          </Button>
          <SignedOut>
            <Button
              className="w-20 text-white hover:bg-[#d67900] h-full rounded-none hover:text-white"
              variant={"ghost"}
              asChild
            >
              <SignUpButton />
            </Button>
            <Button
              className="w-24 bg-[#D67900] hover:bg-white hover:text-[#D67900]"
              asChild
            >
              <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <div className="px-4 hover:bg-[#d67900] h-full rounded-none flex items-center justify-center">
              <UserButton />
            </div>
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
