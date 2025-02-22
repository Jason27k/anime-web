"use client";
import React, { useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Eye } from "lucide-react";

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  // If the user is already signed in,
  // redirect them to the home page
  if (isSignedIn) {
    router.push("/");
  }

  // Send the password reset code to the user's email
  async function create(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({ session: result.createdSessionId });
          setError("");
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  return (
    <div className="h-[50vh] pt-20">
      <div className="grid w-full flex-grow items-center px-4 sm:justify-center">
        <div className="w-full space-y-6 rounded-2xl bg-[#2B2D32] px-4 py-10 shadow-md ring-1 ring-black/5 sm:w-96 sm:px-8">
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
              Forgot Password?
            </h1>
          </header>
          <div>
            <form
              onSubmit={!successfulCreation ? create : reset}
              className="space-y-4"
            >
              {!successfulCreation && (
                <div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-white"
                    >
                      Please provide your email address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="john@doe.com"
                      className="w-full rounded-md bg-zinc-300 px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {error && (
                      <p className="block text-sm text-red-400">{error}</p>
                    )}
                  </div>
                  <div>
                    <button className="w-full rounded-md bg-[#D67900] px-3.5 py-1.5 mt-5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-[#D67900] hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70">
                      Send password reset code
                    </button>
                  </div>
                </div>
              )}

              {successfulCreation && (
                <>
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-white"
                    >
                      Enter your new password
                    </label>
                    <div className="relative">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        required
                        placeholder="Password"
                        className="w-full rounded-md bg-zinc-300 px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    {error && (
                      <p className="block text-sm text-red-400">{error}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-white"
                    >
                      Enter the password reset code that was sent to your email
                    </label>
                    <div className="w-full flex justify-center">
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        value={code}
                        onChange={(e) => setCode(String(e))}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      {error && (
                        <p className="block text-sm text-red-400 text-center">
                          {error}
                        </p>
                      )}
                    </div>
                  </div>
                  <button className="w-full rounded-md bg-[#D67900] px-3.5 mt-2 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-[#D67900] hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70">
                    Reset
                  </button>
                  {error && <p>{error}</p>}
                </>
              )}

              {secondFactor && (
                <p>2FA is required, but this UI does not handle that</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
