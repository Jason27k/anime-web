import { Skeleton } from "@/components/ui/skeleton";

export default function AnimeDetailLoading() {
  return (
    <div>
      {/* ── Hero ── */}
      <div className="relative w-[calc(100%+2.5rem)] -mx-5 -mt-6 lg:w-[calc(100%+5rem)] lg:-mx-10 xl:w-[calc(100%+8.5rem)] xl:-mx-17 2xl:w-[calc(100%+12rem)] 2xl:-mx-24 min-[1750px]:mx-0 min-[1750px]:w-full h-[480px] md:h-[580px] overflow-hidden flex items-end pb-16 px-5 lg:px-10 xl:px-17 2xl:px-24">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="relative z-10 max-w-4xl w-full space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-16 md:h-20 w-2/3 rounded-lg" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-11 w-36 rounded-lg" />
            <Skeleton className="h-11 w-44 rounded-lg" />
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-24 -mt-8">

        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <Skeleton className="aspect-[2/3] rounded-xl w-full" />
          <div className="bg-surface-container-low p-6 rounded-xl space-y-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <div className="flex flex-wrap gap-1.5">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-14 rounded" />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Column */}
        <div className="lg:col-span-9 space-y-16">

          {/* Synopsis */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-8 h-1 rounded-full" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="bg-surface-container-low p-8 rounded-2xl space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className={`h-4 ${i === 4 ? "w-3/4" : "w-full"}`} />
              ))}
            </div>
          </section>

          {/* Characters & Cast */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-8 h-1 rounded-full" />
              <Skeleton className="h-8 w-48" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-14 h-14 rounded-full shrink-0" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="text-right space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Staff */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-8 h-1 rounded-full" />
              <Skeleton className="h-8 w-40" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-surface-container-low p-5 rounded-xl flex flex-col items-center gap-2">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      {/* ── Recommendations ── */}
      <section className="w-[calc(100%+2.5rem)] -mx-5 lg:w-[calc(100%+5rem)] lg:-mx-10 xl:w-[calc(100%+8.5rem)] xl:-mx-17 2xl:w-[calc(100%+12rem)] 2xl:-mx-24 min-[1750px]:mx-0 min-[1750px]:w-full bg-surface-container-low/50 py-20 px-5 lg:px-10 xl:px-17 2xl:px-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-10 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-72" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] rounded-lg w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
