import { fetchDaySchedule } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import AnimeDay from "./AnimeDay";

export function AnimeDaySkeleton({ defaultExpanded }: { defaultExpanded: boolean }) {
  if (defaultExpanded) {
    return (
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
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 min-[600px]:grid-cols-3 min-[900px]:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-5 xl:gap-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="w-full h-52 rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="flex items-center justify-between w-full p-3 sm:p-6 rounded-xl bg-surface-container-low gap-2">
      <div className="flex items-center gap-3 sm:gap-6">
        <Skeleton className="h-6 w-24 sm:h-7 sm:w-32" />
        <div className="hidden sm:flex gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/20" />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
    </div>
  );
}

const AnimeDayLoader = async ({
  dayStart,
  dayEnd,
  name,
  dateLabel,
  defaultExpanded,
}: {
  dayStart: number;
  dayEnd: number;
  name: string;
  dateLabel: string;
  defaultExpanded: boolean;
}) => {
  const schedules = await fetchDaySchedule(dayStart, dayEnd);

  return (
    <AnimeDay
      day={name}
      dateLabel={dateLabel}
      defaultExpanded={defaultExpanded}
      airingSchedules={schedules}
    />
  );
};

export default AnimeDayLoader;
