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
      <div className="bg-[#2B2D32] h-20 flex items-center justify-between px-5 md:px-10 lg:px-20 xl:px-30 2xl:px-[15vw] sticky top-0 z-50 w-screen">
        <Link href="/" className="flex items-center justify-between">
          <Image src="./dragon.svg" alt="Dragon" width={40} height={40} />
          <h1 className="text-2xl pl-5 text-white">AnimeTrove</h1>
        </Link>
        <div className="md:hidden">
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
                    <Link href="search" className="flex gap-2">
                      <Search size={24} />
                      <p className="text-lg ">Search</p>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="liked" className="flex gap-2">
                      <Heart size={24} />
                      <p className="text-lg">Liked</p>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="calendar" className="flex gap-2">
                      <Calendar size={24} />
                      <p className="text-lg">Calendar</p>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="sign-up" className="flex gap-2">
                      <UserPen size={24} />
                      <p className="text-lg">Sign Up</p>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button className="w-24 bg-[#D67900] text-lg hover:bg-white hover:text-[#D67900]">
                      <Link href="login" className="flex gap-2">
                        <LogIn size={24} />
                        <p>Login</p>
                      </Link>
                    </Button>
                  </SheetClose>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
        <div className="items-center gap-4 hidden md:flex">
          <Button
            className="w-20 text-white hover:bg-[#d679009d] hover:text-white"
            variant={"ghost"}
            asChild
          >
            <Link href="search">Search</Link>
          </Button>
          <Button
            className="w-20 text-white hover:bg-[#d679009d] hover:text-white"
            variant={"ghost"}
            asChild
          >
            <Link href="liked">Liked</Link>
          </Button>
          <Button
            className="w-20 text-white hover:bg-[#d679009d] hover:text-white"
            variant={"ghost"}
            asChild
          >
            <Link href="calendar">Calendar</Link>
          </Button>
          <SignedOut>
            <Button
              className="w-20 text-white hover:bg-[#d679009d] hover:text-white"
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
            <UserButton />
          </SignedIn>
        </div>
      </div>
      <div className="px-5 md:px-10 lg:px-20 xl:px-30 2xl:px-[15vw] w-screen">
        {children}
      </div>
    </div>
  );
};

export default Header;
