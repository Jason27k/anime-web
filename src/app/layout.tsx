import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import Provider from "./Provider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const robo = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnimeTrove",
  description: "AnimeTrove is a anime discovery platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body
          className={cn(
            "bg-[#141414] h-screen overflow-x-hidden",
            robo.className
          )}
        >
          <Header>
            <Provider>
              <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
            </Provider>
          </Header>
        </body>
      </html>
    </ClerkProvider>
  );
}
