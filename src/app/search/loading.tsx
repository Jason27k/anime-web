import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPage() {
  return (
    <div className="w-full">
      {/* Page header */}
      <header className="mb-10">
        <div className="flex items-baseline gap-4 mb-2">
          <Skeleton className="h-3 w-20 bg-primary/30" />
          <div className="h-px flex-grow bg-gradient-to-r from-primary/20 to-transparent" />
        </div>
        <Skeleton className="h-16 md:h-20 w-48 mb-3 bg-surface-container-high" />
        <Skeleton className="h-4 w-72 bg-surface-container-high" />
      </header>

      {/* Filter bar */}
      <div className="bg-surface-container-low rounded-2xl p-4 md:p-6 mb-4">
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
          {/* Title */}
          <div className="flex flex-col gap-1.5 w-full">
            <Skeleton className="h-3 w-8 bg-surface-container-high" />
            <Skeleton className="h-[42px] w-full rounded-lg bg-surface-container" />
          </div>
          <div className="flex w-full justify-between flex-wrap md:flex-nowrap gap-3">
            {/* Genres, Year, Season */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5 w-full">
                <Skeleton className="h-3 w-12 bg-surface-container-high" />
                <Skeleton className="h-[42px] w-full rounded-lg bg-surface-container" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sort row */}
      <div className="flex items-center gap-2 pb-4 flex-wrap">
        <Skeleton className="h-3 w-10 bg-surface-container-high" />
        <div className="flex flex-wrap gap-1.5">
          {[80, 96, 72, 64, 72].map((w, i) => (
            <Skeleton
              key={i}
              className={`h-6 rounded-full bg-surface-container-high`}
              style={{ width: w }}
            />
          ))}
        </div>
      </div>

      {/* Anime grid */}
      <div className="grid grid-cols-2 min-[600px]:grid-cols-3 min-[900px]:grid-cols-4 min-[1200px]:grid-cols-5 xl:grid-cols-6 gap-4 pt-2">
        {[...Array(12)].map((_, i) => (
          <AnimeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function AnimeCardSkeleton() {
  return (
    <div className="flex flex-col w-full max-w-[200px] mx-auto gap-3">
      <Skeleton className="w-full aspect-[2/3] rounded-lg bg-surface-container-high" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-full bg-surface-container-high" />
        <Skeleton className="h-3.5 w-3/4 bg-surface-container-high" />
        <Skeleton className="h-3 w-1/2 bg-surface-container" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-10 bg-surface-container" />
          <Skeleton className="h-3 w-10 bg-surface-container" />
        </div>
      </div>
    </div>
  );
}
