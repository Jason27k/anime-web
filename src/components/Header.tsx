"use client";
import React, { ReactNode } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Calendar, Search } from "lucide-react";
import Logo from "./Logo";
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
    <div>
      <nav className="bg-background/75 backdrop-blur-xl border-b border-white/5 h-16 sticky top-0 z-50 w-screen shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="max-w-[1750px] mx-auto flex flex-row items-center justify-between px-5 lg:px-10 xl:px-17 2xl:px-24 h-full">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Logo className="w-8 h-8 shrink-0 -translate-y-1" />
          <span className="text-xl font-black tracking-tighter text-foreground hidden md:block group-hover:text-primary transition-colors duration-200 uppercase">
            AnimeTrove
          </span>
        </Link>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-1">
          <Link
            href="/search"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 active:bg-white/10 transition-all duration-200"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/calendar"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 active:bg-white/10 transition-all duration-200"
          >
            <Calendar className="h-5 w-5" />
          </Link>
          <SignedIn>
            <Link href="/my-anime" className="ml-1 p-0.5 rounded-full ring-1 ring-transparent hover:ring-primary transition-all duration-200">
              <img
                src={user?.imageUrl}
                alt={user?.fullName || "Profile"}
                className="h-8 w-8 rounded-full object-cover"
              />
            </Link>
          </SignedIn>
          <SignedOut>
            <Button
              className="bg-primary text-background font-bold text-sm px-4 hover:bg-primary/80 transition-all duration-200"
              asChild
            >
              <SignInButton />
            </Button>
          </SignedOut>
        </div>

        {/* Desktop Nav */}
        <div className="items-center gap-1 hidden md:flex h-full">
          <Link
            href="/search"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200 text-sm font-medium"
          >
            <Search className="h-4 w-4 group-hover:text-primary transition-colors duration-200" />
            Search
          </Link>
          <Link
            href="/calendar"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200 text-sm font-medium"
          >
            <Calendar className="h-4 w-4 group-hover:text-primary transition-colors duration-200" />
            Calendar
          </Link>

          <div className="w-px h-5 bg-outline-variant/30 mx-2" />

          <SignedOut>
            <Button
              className="text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200 text-sm font-medium"
              variant="ghost"
              asChild
            >
              <SignUpButton />
            </Button>
            <Button
              className="bg-primary text-background font-bold hover:bg-primary/80 transition-all duration-200 text-sm"
              asChild
            >
              <SignInButton />
            </Button>
          </SignedOut>

          <SignedIn>
            <Link
              href="/my-anime"
              className="p-0.5 rounded-full ring-1 ring-transparent hover:ring-primary transition-all duration-200"
            >
              <img
                src={user?.imageUrl}
                alt={user?.fullName || "Profile"}
                className="h-8 w-8 rounded-full object-cover"
              />
            </Link>
          </SignedIn>
        </div>
        </div>
      </nav>

      <div className="max-w-[1750px] mx-auto px-5 pt-6 pb-10 lg:px-10 xl:px-17 2xl:px-24 relative">
        {children}
      </div>
    </div>
  );
};

export default Header;
