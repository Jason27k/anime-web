"use client";

import Link from "next/link";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useState } from "react";
import { Eye } from "lucide-react";
import Logo from "@/components/Logo";

export default function SignInPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-sm">
        <SignIn.Root>
          <SignIn.Step
            name="start"
            className="w-full space-y-6 rounded-xl bg-surface-container border border-border px-8 py-10 shadow-lg"
          >
            <header className="text-center">
              <Logo className="w-10 h-10 mx-auto mb-4" />
              <h1 className="text-xl font-black tracking-tight text-foreground uppercase">
                Sign in to AnimeTrove
              </h1>
            </header>

            <Clerk.GlobalError className="block text-sm text-destructive" />

            <div className="space-y-4">
              <Clerk.Field name="identifier" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-muted-foreground">
                  Username or Email
                </Clerk.Label>
                <Clerk.Input
                  type="text"
                  required
                  placeholder="Username or email"
                  className="w-full rounded-lg bg-surface-container-high text-foreground placeholder:text-muted-foreground/50 px-3.5 py-2 text-sm outline-none ring-1 ring-border hover:ring-outline focus:ring-primary transition-all"
                />
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
                    className="w-full rounded-lg bg-surface-container-high text-foreground placeholder:text-muted-foreground/50 px-3.5 py-2 text-sm outline-none ring-1 ring-border hover:ring-outline focus:ring-primary transition-all"
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

            <SignIn.Action
              submit
              className="w-full rounded-lg bg-primary text-primary-foreground font-bold text-sm px-4 py-2 hover:bg-primary/80 transition-all duration-200 text-center"
            >
              Sign In
            </SignIn.Action>

            <p className="text-center text-sm text-muted-foreground">
              <Link
                href="/forgot-password"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </p>
            <p className="text-center text-sm text-muted-foreground">
              No account?{" "}
              <Link
                href="/sign-up"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Create one
              </Link>
            </p>
          </SignIn.Step>
        </SignIn.Root>
      </div>
    </div>
  );
}
