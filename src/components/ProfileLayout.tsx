"use client";

import ProfileSidebar from "./ProfileSidebar";
import { ReactNode } from "react";

interface ProfileLayoutProps {
  children: ReactNode;
  stats?: {
    watching: number;
    completed: number;
    dropped: number;
    total: number;
  };
}

export default function ProfileLayout({ children, stats }: ProfileLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Fixed width on desktop, full width on mobile */}
        <aside className="w-full lg:w-72 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-20">
            <ProfileSidebar stats={stats} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
