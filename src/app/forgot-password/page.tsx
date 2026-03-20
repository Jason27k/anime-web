"use client";
import React, { useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Eye } from "lucide-react";
import Logo from "@/components/Logo";

const inputClass =
  "w-full rounded-lg bg-surface-container-high text-foreground placeholder:text-muted-foreground/50 px-3.5 py-2 text-sm outline-none ring-1 ring-border hover:ring-outline focus:ring-primary transition-all";

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

  if (!isLoaded) return null;
  if (isSignedIn) router.push("/");

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.create({ strategy: "reset_password_email_code", identifier: email })
      .then(() => { setSuccessfulCreation(true); setError(""); })
      .catch((err) => setError(err.errors[0].longMessage));
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.attemptFirstFactor({ strategy: "reset_password_email_code", code, password })
      .then((result) => {
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          setActive({ session: result.createdSessionId });
          setError("");
        }
      })
      .catch((err) => setError(err.errors[0].longMessage));
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-sm">
        <div className="w-full space-y-6 rounded-xl bg-surface-container border border-border px-8 py-10 shadow-lg">
          <header className="text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <h1 className="text-xl font-black tracking-tight text-foreground uppercase">
              Forgot Password?
            </h1>
          </header>

          <form onSubmit={!successfulCreation ? create : reset} className="space-y-4">
            {!successfulCreation && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                    Email address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="john@doe.com"
                    className={inputClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
                <button className="w-full rounded-lg bg-primary text-primary-foreground font-bold text-sm px-4 py-2 hover:bg-primary/80 transition-all duration-200">
                  Send reset code
                </button>
              </div>
            )}

            {successfulCreation && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      required
                      placeholder="New password"
                      className={inputClass}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      aria-label={passwordVisible ? "Hide password" : "Show password"}
                      className="absolute top-2 right-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Reset code
                  </label>
                  <div className="flex justify-center">
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
                  </div>
                  {error && <p className="text-sm text-destructive text-center">{error}</p>}
                </div>

                <button className="w-full rounded-lg bg-primary text-primary-foreground font-bold text-sm px-4 py-2 hover:bg-primary/80 transition-all duration-200">
                  Reset password
                </button>
              </div>
            )}

            {secondFactor && (
              <p className="text-sm text-muted-foreground text-center">
                2FA is required but not supported in this flow.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
