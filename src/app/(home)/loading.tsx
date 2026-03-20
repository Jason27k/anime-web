import { Skeleton } from "@/components/ui/skeleton";

const LoadingPage = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero carousel */}
      <Skeleton className="w-full h-[420px] md:h-[500px] rounded-xl" />

      {/* Seasonal Favorites — text left, 3 cards right */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-4 flex flex-col justify-center gap-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full max-w-xs" />
          <Skeleton className="h-4 w-3/4 max-w-xs" />
          <Skeleton className="h-10 w-44 rounded-full mt-2" />
        </div>
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
          ))}
          <Skeleton className="aspect-[3/4] rounded-lg hidden md:block" />
        </div>
      </section>

      <div className="flex flex-col gap-16">
        {/* Top All Time row */}
        <AnimeRowLoading />
        {/* Most Popular row */}
        <AnimeRowLoading />

        {/* Upcoming — 3 cards left, text right */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
            ))}
            <Skeleton className="aspect-[3/4] rounded-lg hidden md:block" />
          </div>
          <div className="lg:col-span-4 flex flex-col justify-center gap-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-full max-w-xs" />
            <Skeleton className="h-4 w-3/4 max-w-xs" />
            <Skeleton className="h-10 w-44 rounded-full mt-2" />
          </div>
        </section>
      </div>
    </div>
  );
};

const AnimeRowLoading = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-1 w-12 rounded-full" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 min-[600px]:grid-cols-3 min-[900px]:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 xl:gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="w-full h-52 rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
        <div className="flex flex-col gap-2 md:hidden xl:flex">
          <Skeleton className="w-full h-52 rounded-lg" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
