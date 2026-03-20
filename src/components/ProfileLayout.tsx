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
    <div>
      {/* Page Header */}
      <header className="mb-12">
        <span className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-2 block">
          Personal Archive
        </span>
        <h1 className="text-5xl font-black tracking-tight text-foreground">My Library</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="lg:sticky lg:top-20">
            <ProfileSidebar stats={stats} />
          </div>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
