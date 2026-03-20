import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarLoadingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Header */}
      <header className="mb-16">
        <div className="flex items-baseline gap-4 mb-2">
          <Skeleton className="h-4 w-20" />
          <div className="h-px flex-grow bg-gradient-to-r from-primary/30 to-transparent" />
        </div>
        <Skeleton className="h-16 md:h-24 w-3/4 mb-4 rounded-lg" />
        <Skeleton className="h-5 w-72" />
      </header>

      <div className="space-y-4">
        {/* First day — expanded */}
        <section className="mb-12">
          <div className="flex items-center justify-between w-full mb-8 gap-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-36 sm:h-10 sm:w-48" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24 hidden sm:block" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
          </div>
          {/* Expanded card grid */}
          <div className="grid grid-cols-1 min-[360px]:grid-cols-2 min-[600px]:grid-cols-3 min-[900px]:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-5 xl:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="w-full h-52 rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </section>

        {/* Remaining 6 days — collapsed */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between w-full p-3 sm:p-6 rounded-xl bg-surface-container-low gap-2"
          >
            <div className="flex items-center gap-3 sm:gap-6">
              <Skeleton className="h-6 w-24 sm:h-7 sm:w-32" />
              <div className="hidden sm:flex gap-1.5">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
