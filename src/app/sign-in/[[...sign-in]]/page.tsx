"use client";

import Link from "next/link";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Image from "next/image";
import { useState } from "react";
import { Eye } from "lucide-react";

export default function SignInPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="h-[50vh] pt-20">
      <div className="grid w-full flex-grow items-center px-4 sm:justify-center">
        <SignIn.Root>
          <SignIn.Step
            name="start"
            className="w-full space-y-6 rounded-2xl bg-[#2B2D32] px-4 py-10 shadow-md ring-1 ring-black/5 sm:w-96 sm:px-8"
          >
            <header className="text-center">
              <div className="w-full">
                <Image
                  src="/dragon.svg"
                  alt="logo"
                  width={50}
                  height={50}
                  className="mx-auto"
                />
              </div>
              <h1 className="mt-4 text-xl font-medium tracking-tight text-white">
                Sign in to AnimeTrove
              </h1>
            </header>
            <Clerk.GlobalError className="block text-sm text-red-400" />
            <div className="space-y-4">
              <Clerk.Field name="identifier" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-white">
                  Username or Email
                </Clerk.Label>
                <Clerk.Input
                  type="text"
                  required
                  placeholder="Username/Email"
                  className="w-full rounded-md bg-zinc-300 px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>
              <Clerk.Field name="password" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-white">
                  Password
                </Clerk.Label>
                <div className="relative">
                  <Clerk.Input
                    type={passwordVisible ? "text" : "password"}
                    required
                    placeholder="Password"
                    className="w-full rounded-md bg-zinc-300 px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    aria-label={
                      passwordVisible ? "Hide password" : "Show password"
                    }
                  >
                    <Eye size={20} className="absolute top-[8px] right-2" />
                  </button>
                </div>
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>
            </div>
            <SignIn.Action
              submit
              className="w-full rounded-md bg-[#D67900] px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-[#D67900] hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
            >
              Sign In
            </SignIn.Action>
            <p className="text-center text-sm text-zinc-500">
              <Link
                href="/forgot-password"
                className="font-medium text-white decoration-zinc-950/20 underline-offset-4 outline-none hover:text-zinc-500 hover:underline focus-visible:underline"
              >
                Forgot password?
              </Link>
            </p>
            <p className="text-center text-sm text-zinc-300">
              No account?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-white decoration-zinc-950/20 underline-offset-4 outline-none hover:text-zinc-500 hover:underline focus-visible:underline"
              >
                Create an account
              </Link>
            </p>
          </SignIn.Step>
        </SignIn.Root>
      </div>
    </div>
  );
}
