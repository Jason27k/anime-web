"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { LogOut, KeyRound } from "lucide-react";

interface ProfileSidebarProps {
  stats?: {
    watching: number;
    completed: number;
    dropped: number;
    total: number;
  };
}

export default function ProfileSidebar({ stats }: ProfileSidebarProps) {
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <section className="bg-surface-container p-6 rounded-xl border border-outline-variant/10">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user?.imageUrl}
            alt={user?.fullName || "User"}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-bold text-foreground leading-tight">
              {user?.fullName || user?.username || "User"}
            </h2>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
              Member since{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "Unknown"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => openUserProfile()}
            className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <KeyRound className="h-4 w-4" />
            Manage Account
          </button>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 text-sm font-medium text-destructive hover:text-red-400 transition-colors w-full text-left"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </section>

      {/* Library Stats */}
      {stats && (
        <section>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">
            Library Stats
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/10">
              <span className="block text-2xl font-black text-primary">{stats.watching}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                Watching
              </span>
            </div>
            <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/10">
              <span className="block text-2xl font-black text-foreground">{stats.completed}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                Completed
              </span>
            </div>
            <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/10">
              <span className="block text-2xl font-black text-foreground">{stats.dropped}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                Dropped
              </span>
            </div>
            <div className="bg-surface-container p-4 rounded-lg border border-outline-variant/10">
              <span className="block text-2xl font-black text-foreground">{stats.total}</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                Total
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
