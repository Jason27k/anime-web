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
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar - Fixed width on tablet+, full width on mobile */}
        <aside className="w-full md:w-64 lg:w-72 md:flex-shrink-0">
          <div className="md:sticky md:top-20">
            <ProfileSidebar stats={stats} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
