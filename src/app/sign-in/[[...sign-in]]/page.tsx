"use client";

import Link from "next/link";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import Image from "next/image";

export default function SignInPage() {
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
                <Clerk.Input
                  type="password"
                  required
                  placeholder="Password"
                  className="w-full rounded-md bg-zinc-300 px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                />
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

// "use client";

// import * as Clerk from "@clerk/elements/common";
// import * as SignIn from "@clerk/elements/sign-in";
// import Link from "next/link";

// export default function SignInPage() {
//   return (
//     <div className="grid w-full flex-grow items-center  px-4 sm:justify-center">
//       <SignIn.Root>
// <SignIn.Step
//   name="start"
//   className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:w-96 sm:px-8"
// >
//   <header className="text-center">
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 40 40"
//       className="mx-auto size-10 text-zinc-950"
//       aria-hidden
//     >
//       <mask
//         id="a"
//         width="40"
//         height="40"
//         x="0"
//         y="0"
//         maskUnits="userSpaceOnUse"
//       >
//         <circle cx="20" cy="20" r="20" fill="#D9D9D9" />
//       </mask>
//       <g fill="currentColor" mask="url(#a)">
//         <path d="M43.5 3a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V2ZM43.5 8a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V7ZM43.5 13a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 18a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 23a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 28a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 33a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 38a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1Z" />
//         <path d="M27 3.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 8.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM23 13.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM21.5 18.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM20.5 23.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM22.5 28.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 33.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM27 38.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2Z" />
//       </g>
//     </svg>
//     <h1 className="mt-4 text-xl font-medium tracking-tight text-zinc-950">
//       Sign in to Clover
//     </h1>
//   </header>
//   <Clerk.GlobalError className="block text-sm text-red-400" />
//   <div className="space-y-4">
//     <Clerk.Field name="identifier" className="space-y-2">
//       <Clerk.Label className="text-sm font-medium text-zinc-950">
//         Username or Email
//       </Clerk.Label>
//       <Clerk.Input
//         type="text"
//         required
//         className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
//       />
//       <Clerk.FieldError className="block text-sm text-red-400" />
//     </Clerk.Field>
//     <Clerk.Field name="password" className="space-y-2">
//       <Clerk.Label className="text-sm  font-medium text-zinc-950">
//         Password
//       </Clerk.Label>
//       <Clerk.Input
//         type="password"
//         required
//         className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
//       />
//       <Clerk.FieldError className="block text-sm text-red-400" />
//     </Clerk.Field>
//   </div>
//   <SignIn.Action
//     submit
//     className="w-full rounded-md bg-zinc-950 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
//   >
//     Sign In
//   </SignIn.Action>
//   <p className="text-center text-sm text-zinc-500">
//     No account?{" "}
//     <Link
//       href="/sign-up"
//       className="font-medium text-zinc-950 decoration-zinc-950/20 underline-offset-4 outline-none hover:text-zinc-700 hover:underline focus-visible:underline"
//     >
//       Create an account
//     </Link>
//   </p>
// </SignIn.Step>
//       </SignIn.Root>
//     </div>
//   );
// }
