"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Eye } from "lucide-react";

export default function SignUpPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="h-[50vh] pt-20">
      <div className="grid w-full flex-grow items-center px-4 sm:justify-center">
        <SignUp.Root>
          <SignUp.Step
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
                Create an account
              </h1>
            </header>
            <Clerk.GlobalError className="block text-sm text-red-400" />
            <div className="space-y-4">
              <Clerk.Field name="username" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-white">
                  Username
                </Clerk.Label>
                <Clerk.Input
                  type="text"
                  required
                  placeholder="Username"
                  className="w-full rounded-md bg-zinc-300 px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>
              <Clerk.Field name="emailAddress" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-white">
                  Email
                </Clerk.Label>
                <Clerk.Input
                  type="email"
                  required
                  placeholder="Email"
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
            <SignUp.Action
              submit
              className="w-full rounded-md bg-[#D67900] px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-[#D67900] hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
            >
              Sign Up
            </SignUp.Action>

            <p className="text-center text-sm text-zinc-300">
              Already have an account?{" "}
              <Link
                href="sign-in"
                className="font-medium text-white decoration-zinc-950/20 underline-offset-4 outline-none hover:text-zinc-700 hover:underline focus-visible:underline"
              >
                Sign in
              </Link>
            </p>
          </SignUp.Step>
          <SignUp.Step
            name="verifications"
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
                Verify email code
              </h1>
            </header>
            <Clerk.GlobalError className="block text-sm text-red-400" />
            <SignUp.Strategy name="email_code">
              <Clerk.Field name="code" className="space-y-2">
                <Clerk.Input
                  type="otp"
                  className="flex justify-center has-[:disabled]:opacity-50 text-white"
                  autoSubmit
                  render={({ value, status }) => {
                    return (
                      <div
                        data-status={status}
                        className={cn(
                          "relative flex size-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
                          {
                            "z-10 ring-1 ring-ring ring-offset-background caret-white ring-white":
                              status === "cursor" || status === "selected",
                          }
                        )}
                      >
                        {value}
                        {status === "cursor" && (
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="animate-caret-blink h-4 w-px bg-foreground border-white duration-1000" />
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
                <Clerk.FieldError className="block text-sm text-red-400 text-center" />
              </Clerk.Field>
              <SignUp.Action
                submit
                className="w-full rounded-md bg-[#D67900] px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-[#D67900] hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
              >
                Verify
              </SignUp.Action>
            </SignUp.Strategy>
            <p className="text-center text-sm text-zinc-300">
              Already have an account?{" "}
              <Link
                href="sign-in"
                className="font-medium text-white decoration-zinc-950/20 underline-offset-4 outline-none hover:text-zinc-700 hover:underline focus-visible:underline"
              >
                Sign in
              </Link>
            </p>
          </SignUp.Step>
          <SignUp.Step
            name="continue"
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
                Continue registration
              </h1>
            </header>
            <Clerk.GlobalError className="block text-sm text-red-400" />
            <Clerk.Field name="username" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-zinc-950">
                Username
              </Clerk.Label>
              <Clerk.Input
                type="text"
                placeholder="Username"
                required
                className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
              />
              <Clerk.FieldError className="block text-sm text-red-400" />
            </Clerk.Field>
            <SignUp.Action
              submit
              className="w-full rounded-md bg-[#D67900] px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-[#D67900] hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
            >
              Continue
            </SignUp.Action>
            <p className="text-center text-sm text-zinc-300">
              Already have an account?{" "}
              <Link
                href="sign-in"
                className="font-medium text-white decoration-zinc-950/20 underline-offset-4 outline-none hover:text-zinc-700 hover:underline focus-visible:underline"
              >
                Sign in
              </Link>
            </p>
          </SignUp.Step>
        </SignUp.Root>
      </div>
    </div>
  );
}
