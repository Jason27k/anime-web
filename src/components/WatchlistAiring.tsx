"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AiringSchedule } from "@/utils/anilistTypes";
import AnimeMediumResizable from "./Cards/AnimeCardMediumResizable";

interface WatchlistAiringProps {
  schedules: AiringSchedule[];
  totalCount: number;
}

const WatchlistAiring = ({ schedules, totalCount }: WatchlistAiringProps) => {
  if (schedules.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
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
        <Link
          href="/calendar"
          className="text-primary text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all"
        >
          Full Schedule <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 min-[600px]:grid-cols-3 min-[900px]:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 xl:gap-6">
        {schedules.map((schedule) => (
          <AnimeMediumResizable
            key={schedule.id}
            anime={schedule.media}
            airing={schedule.airingAt}
          />
        ))}
      </div>
    </div>
  );
};

export default WatchlistAiring;
