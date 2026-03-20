import { Suspense } from "react";
import { fetchMyAnimeIds } from "@/app/actions";
import { getDayRanges } from "@/utils/date";
import { currentUser } from "@clerk/nextjs/server";
import CalendarShell from "./CalendarShell";
import AnimeDayLoader, { AnimeDaySkeleton } from "./AnimeDayLoader";

const CalendarContent = async () => {
  const [[user, ids], dayRanges] = await Promise.all([
    Promise.all([currentUser(), fetchMyAnimeIds()]),
    Promise.resolve(getDayRanges()),
  ]);

  return (
    <CalendarShell loggedIn={!!user?.id} ids={ids || []}>
      {dayRanges.map((day, i) => (
        <Suspense key={day.start} fallback={<AnimeDaySkeleton defaultExpanded={i === 0} />}>
          <AnimeDayLoader
            dayStart={day.start}
            dayEnd={day.end}
            name={day.name}
            dateLabel={day.dateLabel}
            defaultExpanded={i === 0}
          />
        </Suspense>
      ))}
    </CalendarShell>
  );
};

export default CalendarContent;
