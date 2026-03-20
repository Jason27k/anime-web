"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Eye } from "lucide-react";
import Logo from "@/components/Logo";

const inputClass =
  "w-full rounded-lg bg-surface-container-high text-foreground placeholder:text-muted-foreground/50 px-3.5 py-2 text-sm outline-none ring-1 ring-border hover:ring-outline focus:ring-primary transition-all";

const cardClass =
  "w-full space-y-6 rounded-xl bg-surface-container border border-border px-8 py-10 shadow-lg";

export default function SignUpPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-sm">
        <SignUp.Root>
          {/* Step 1: Registration */}
          <SignUp.Step name="start" className={cardClass}>
            <header className="text-center">
              <Logo className="w-10 h-10 mx-auto mb-4" />
              <h1 className="text-xl font-black tracking-tight text-foreground uppercase">
                Create an account
              </h1>
            </header>
            <Clerk.GlobalError className="block text-sm text-destructive" />
            <div className="space-y-4">
              <Clerk.Field name="username" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-muted-foreground">
                  Username
                </Clerk.Label>
                <Clerk.Input type="text" required placeholder="Username" className={inputClass} />
                <Clerk.FieldError className="block text-sm text-destructive" />
              </Clerk.Field>
              <Clerk.Field name="emailAddress" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-muted-foreground">
                  Email
                </Clerk.Label>
                <Clerk.Input type="email" required placeholder="Email" className={inputClass} />
                <Clerk.FieldError className="block text-sm text-destructive" />
              </Clerk.Field>
              <Clerk.Field name="password" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-muted-foreground">
                  Password
                </Clerk.Label>
                <div className="relative">
                  <Clerk.Input
                    type={passwordVisible ? "text" : "password"}
                    required
                    placeholder="Password"
                    className={inputClass}
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
                <Clerk.FieldError className="block text-sm text-destructive" />
              </Clerk.Field>
            </div>
            <SignUp.Action
              submit
              className="w-full rounded-lg bg-primary text-primary-foreground font-bold text-sm px-4 py-2 hover:bg-primary/80 transition-all duration-200 text-center"
            >
              Sign Up
            </SignUp.Action>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </SignUp.Step>

          {/* Step 2: Email verification */}
          <SignUp.Step name="verifications" className={cardClass}>
            <header className="text-center">
              <Logo className="w-10 h-10 mx-auto mb-4" />
              <h1 className="text-xl font-black tracking-tight text-foreground uppercase">
                Verify your email
              </h1>
            </header>
            <Clerk.GlobalError className="block text-sm text-destructive" />
            <SignUp.Strategy name="email_code">
              <Clerk.Field name="code" className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Enter the code sent to your email address.
                </p>
                <Clerk.Input
                  type="otp"
                  className="flex justify-center has-[:disabled]:opacity-50 text-foreground"
                  autoSubmit
                  render={({ value, status }) => (
                    <div
                      data-status={status}
                      className={cn(
                        "relative flex size-10 items-center justify-center border-y border-r border-border text-sm transition-all first:rounded-l-lg first:border-l last:rounded-r-lg bg-surface-container-high text-foreground",
                        {
                          "z-10 ring-1 ring-primary": status === "cursor" || status === "selected",
                        }
                      )}
                    >
                      {value}
                      {status === "cursor" && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <div className="animate-caret-blink h-4 w-px bg-primary duration-1000" />
                        </div>
                      )}
                    </div>
                  )}
                />
                <Clerk.FieldError className="block text-sm text-destructive text-center" />
              </Clerk.Field>
              <SignUp.Action
                submit
                className="w-full rounded-lg bg-primary text-primary-foreground font-bold text-sm px-4 py-2 hover:bg-primary/80 transition-all duration-200 text-center"
              >
                Verify
              </SignUp.Action>
            </SignUp.Strategy>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </SignUp.Step>

          {/* Step 3: Continue (username) */}
          <SignUp.Step name="continue" className={cardClass}>
            <header className="text-center">
              <Logo className="w-10 h-10 mx-auto mb-4" />
              <h1 className="text-xl font-black tracking-tight text-foreground uppercase">
                Almost there
              </h1>
            </header>
            <Clerk.GlobalError className="block text-sm text-destructive" />
            <Clerk.Field name="username" className="space-y-2">
              <Clerk.Label className="text-sm font-medium text-muted-foreground">
                Username
              </Clerk.Label>
              <Clerk.Input type="text" placeholder="Username" required className={inputClass} />
              <Clerk.FieldError className="block text-sm text-destructive" />
            </Clerk.Field>
            <SignUp.Action
              submit
              className="w-full rounded-lg bg-primary text-primary-foreground font-bold text-sm px-4 py-2 hover:bg-primary/80 transition-all duration-200 text-center"
            >
              Continue
            </SignUp.Action>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:text-primary/80 transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </SignUp.Step>
        </SignUp.Root>
      </div>
    </div>
  );
}
