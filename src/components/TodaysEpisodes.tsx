"use client";

import { useContext, useMemo } from "react";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { AiringSchedule } from "@/utils/anilistTypes";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { formatTimeUntilAiring } from "@/utils/date";

interface TodaysEpisodesProps {
  schedules: AiringSchedule[];
  currentTimestamp: number;
  maxDisplay?: number;
}

const TodaysEpisodes = ({
  schedules,
  currentTimestamp,
  maxDisplay = 8,
}: TodaysEpisodesProps) => {
  const languageContext = useContext(LanguageContext);

  const { displayedSchedules, remainingCount } = useMemo(() => {
    const upcoming = schedules.filter((s) => s.airingAt > currentTimestamp);
    const aired = schedules.filter((s) => s.airingAt <= currentTimestamp);
    // Prioritize upcoming, then fill with aired
    const ordered = [...upcoming, ...aired];
    return {
      displayedSchedules: ordered.slice(0, maxDisplay),
      remainingCount: Math.max(0, ordered.length - maxDisplay),
    };
  }, [schedules, currentTimestamp, maxDisplay]);

  if (schedules.length === 0) {
    return null;
  }

  // Separate displayed schedules back into upcoming/aired for styling
  const upcoming = displayedSchedules.filter((s) => s.airingAt > currentTimestamp);
  const aired = displayedSchedules.filter((s) => s.airingAt <= currentTimestamp);

  const getTitle = (schedule: AiringSchedule) => {
    const { title } = schedule.media;
    return (
      (languageContext.language === LanguageType.English
        ? title.english
        : languageContext.language === LanguageType.Romanji
        ? title.romaji
        : title.native) ?? title.romaji
    );
  };

  const EpisodeCard = ({
    schedule,
    isAired,
  }: {
    schedule: AiringSchedule;
    isAired: boolean;
  }) => {
    const title = getTitle(schedule);
    const timeText = formatTimeUntilAiring(schedule.airingAt);

    return (
      <Link
        href={`/anime/${schedule.media.id}`}
        className="flex-shrink-0 w-[140px] sm:w-[160px] group"
      >
        <div className="relative">
          <img
            src={schedule.media.coverImage.extraLarge}
            alt={title}
            loading="lazy"
            className={`w-full aspect-[3/4] object-cover rounded-lg bg-[#191d26] ${
              isAired ? "opacity-60" : ""
            }`}
          />
          {/* Episode Badge */}
          <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold bg-orange-500 text-white rounded">
            Ep {schedule.episode}
          </span>
          {/* Time/Status Badge */}
          <div
            className={`absolute bottom-2 left-2 right-2 px-2 py-1 text-xs font-medium rounded ${
              isAired
                ? "bg-gray-700/90 text-gray-300"
                : "bg-black/80 text-orange-400"
            }`}
          >
            <div className="flex items-center gap-1 justify-center">
              <Clock size={12} />
              <span>{timeText}</span>
            </div>
          </div>
        </div>
        <h3 className="mt-2 text-sm text-white line-clamp-2 group-hover:text-orange-400 transition-colors">
          {title}
        </h3>
      </Link>
    );
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">Today&apos;s Episodes</h2>
          {schedules.length > 0 && (
            <span className="text-sm text-gray-400">({schedules.length} total)</span>
          )}
        </div>
        <Link
          href="/calendar"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-orange-400 transition-colors"
        >
          Full Schedule
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {/* Upcoming episodes first */}
          {upcoming.map((schedule) => (
            <EpisodeCard
              key={schedule.id}
              schedule={schedule}
              isAired={false}
            />
          ))}
          {/* Then aired episodes */}
          {aired.map((schedule) => (
            <EpisodeCard key={schedule.id} schedule={schedule} isAired={true} />
          ))}
          {/* Show more indicator */}
          {remainingCount > 0 && (
            <Link
              href="/calendar"
              className="flex-shrink-0 w-[140px] sm:w-[160px] flex flex-col items-center justify-center aspect-[3/4] bg-[#1a1d24] hover:bg-[#252a33] rounded-lg transition-colors"
            >
              <span className="text-2xl font-bold text-orange-400">+{remainingCount}</span>
              <span className="text-sm text-gray-400">more today</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodaysEpisodes;
