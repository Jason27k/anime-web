"use client";
import AnimeDay from "./AnimeDay";
import { AiringSchedule } from "@/utils/anilistTypes";
import { convertUTCToLocal } from "@/utils/date";

const AnimeCalendar = ({
  airingSchedules,
  loggedIn,
  ids,
}: {
  airingSchedules: AiringSchedule[];
  loggedIn: boolean;
  ids: number[];
}) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const today = new Date();
  const offset = today.getDay();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Header */}
      <header className="mb-16">
        <div className="flex items-baseline gap-4 mb-2">
          <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase">
            Schedule
          </span>
          <div className="h-px flex-grow bg-gradient-to-r from-primary/30 to-transparent" />
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-4">
          WEEKLY PREMIERES
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
          All times are displayed in your local timezone.
        </p>
      </header>

      <div className="space-y-4">
        {days.map((_, index) => {
          const dayIndex = (index + offset) % 7;
          const daySchedules = airingSchedules.filter(
            (schedule) =>
              convertUTCToLocal(schedule.airingAt).getDay() === dayIndex
          );
          const date = new Date(today);
          date.setDate(today.getDate() + index);
          const dateLabel = date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          });
          return (
            <AnimeDay
              key={index}
              day={days[dayIndex]}
              dateLabel={dateLabel}
              defaultExpanded={index === 0}
              loggedIn={loggedIn}
              ids={ids}
              airingSchedules={daySchedules}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AnimeCalendar;
