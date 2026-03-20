"use client";
import { useState } from "react";
import { AiringSchedule } from "@/utils/anilistTypes";
import { ChevronRight, ChevronDown } from "lucide-react";
import { AnimeMediumFormatted } from "../AnimeMediumFormatted";
import { useCalendar } from "./CalendarContext";

interface AnimeDayProps {
  day: string;
  dateLabel: string;
  defaultExpanded: boolean;
  airingSchedules: AiringSchedule[];
}

const AnimeDay = ({
  day,
  dateLabel,
  defaultExpanded,
  airingSchedules,
}: AnimeDayProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { myListOnly, ids, loggedIn } = useCalendar();

  const visibleSchedules =
    myListOnly && loggedIn
      ? airingSchedules.filter((s) => ids.has(s.media.id))
      : airingSchedules;

  const dotCount = Math.min(visibleSchedules.length, 8);

  if (expanded) {
    return (
      <section className="mb-12">
        <button
          onClick={() => setExpanded(false)}
          className="group flex items-center justify-between w-full mb-8 text-left gap-2 min-w-0"
        >
          <div className="flex items-center gap-3 min-w-0 shrink">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
              {day}
            </h2>
            <span className="px-2 py-1 bg-primary-container/20 text-primary text-xs font-bold rounded-full border border-primary/20 whitespace-nowrap shrink-0">
              {visibleSchedules.length} RELEASES
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="text-muted-foreground text-sm tracking-widest uppercase hidden sm:block">
              {dateLabel}
            </span>
            <ChevronDown
              size={20}
              className="text-muted-foreground group-hover:text-foreground transition-colors"
            />
          </div>
        </button>
        <AnimeMediumFormatted airingSchedules={visibleSchedules} />
      </section>
    );
  }

  return (
    <button
      onClick={() => setExpanded(true)}
      className="group flex items-center justify-between w-full p-3 sm:p-6 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer text-left gap-2 min-w-0"
    >
      <div className="flex items-center gap-3 sm:gap-6 min-w-0 shrink">
        <span className="text-base sm:text-xl md:text-2xl font-bold text-muted-foreground group-hover:text-foreground transition-colors truncate">
          {day}
        </span>
        <div className="hidden sm:flex gap-1.5 shrink-0">
          {Array.from({ length: dotCount }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase whitespace-nowrap">
          <span className="hidden sm:inline">{visibleSchedules.length} PREMIERES</span>
          <span className="sm:hidden">{visibleSchedules.length}</span>
        </span>
        <ChevronRight
          size={16}
          className="text-muted-foreground group-hover:translate-x-1 transition-transform sm:w-5 sm:h-5"
        />
      </div>
    </button>
  );
};

export default AnimeDay;
