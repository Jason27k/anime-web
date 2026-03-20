import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid, PlayCircle, CheckCircle2, XCircle } from "lucide-react";

export default function MyAnimeListLoading() {
  return (
    <div>
      {/* Page header */}
      <header className="mb-12">
        <Skeleton className="h-3 w-36 mb-2 bg-surface-container-high" />
        <Skeleton className="h-12 w-56 bg-surface-container-high" />
      </header>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar skeleton */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="space-y-8">
            {/* Profile section */}
            <section className="bg-surface-container p-6 rounded-xl border border-outline-variant/10">
              <div className="flex items-center gap-4 mb-6">
                <Skeleton className="w-16 h-16 rounded-full bg-surface-container-high" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-32 bg-surface-container-high" />
                  <Skeleton className="h-3 w-24 bg-surface-container-high" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Skeleton className="h-4 w-36 bg-surface-container-high" />
                <Skeleton className="h-4 w-24 bg-surface-container-high" />
              </div>
            </section>

            {/* Stats section */}
            <section>
              <Skeleton className="h-3 w-24 mb-4 bg-surface-container-high" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-surface-container p-4 rounded-lg border border-outline-variant/10"
                  >
                    <Skeleton className="h-8 w-8 mb-1 bg-surface-container-high" />
                    <Skeleton className="h-2.5 w-16 bg-surface-container-high" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </aside>

        {/* Main content skeleton */}
        <main className="flex-1 min-w-0 space-y-8">
          {/* Tab nav */}
          <div className="flex items-center gap-6 md:gap-8 border-b border-border">
            {[
              { icon: LayoutGrid, label: "All", active: true },
              { icon: PlayCircle, label: "Watching", active: false },
              { icon: CheckCircle2, label: "Completed", active: false },
              { icon: XCircle, label: "Dropped", active: false },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <div
                  key={tab.label}
                  className={`flex items-center gap-2 pb-4 text-base font-semibold border-b -mb-px ${
                    tab.active
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {tab.label}
                </div>
              );
            })}
          </div>

          {/* Anime grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {[...Array(10)].map((_, i) => (
              <AnimeCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function AnimeCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full aspect-[2/3] rounded-lg bg-surface-container-high" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-full bg-surface-container-high" />
        <Skeleton className="h-3 w-2/3 bg-surface-container-high" />
        <Skeleton className="h-3 w-1/2 bg-surface-container" />
      </div>
    </div>
  );
}
