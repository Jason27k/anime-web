"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AiringSchedule } from "@/utils/anilistTypes";
import AnimeMediumResizable from "./Cards/AnimeCardMediumResizable";

interface WatchlistAiringProps {
  schedules: AiringSchedule[];
  totalCount: number;
}

const WatchlistAiring = ({ schedules, totalCount }: WatchlistAiringProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (schedules.length === 0) return null;

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -480 : 480, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header — matches AnimeRow style */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
            Your Shows This Week
            {totalCount > 0 && (
              <span className="text-base font-normal text-muted-foreground ml-3">
                ({totalCount} episodes)
              </span>
            )}
          </h2>
          <div className="h-1 w-12 bg-primary rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
          <Link
            href="/calendar"
            className="text-primary text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all"
          >
            Full Schedule <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Horizontal scroll row */}
      <div
        ref={scrollRef}
        className="flex gap-3 md:gap-5 overflow-x-auto hide-scrollbar"
      >
        {schedules.map((schedule) => (
          <div key={schedule.id} className="flex-none w-[140px] sm:w-[160px] md:w-[180px] lg:w-[190px] xl:w-[200px] min-[1750px]:w-[243px]">
            <AnimeMediumResizable
              anime={schedule.media}
              airing={schedule.airingAt}
              loggedIn={false}
              ids={[]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistAiring;
