"use client";

import { useContext } from "react";
import Link from "next/link";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { AiringSchedule } from "@/utils/anilistTypes";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { formatTimeUntilAiring, convertUTCToLocal } from "@/utils/date";

interface WatchlistAiringProps {
  schedules: AiringSchedule[];
  totalCount: number;
  maxDisplay?: number;
}

const WatchlistAiring = ({
  schedules,
  totalCount,
  maxDisplay = 8,
}: WatchlistAiringProps) => {
  const languageContext = useContext(LanguageContext);

  if (schedules.length === 0) {
    return null;
  }

  // Limit displayed schedules
  const displayedSchedules = schedules.slice(0, maxDisplay);
  const remainingCount = totalCount - displayedSchedules.length;

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

  // Group displayed schedules by day
  const groupedByDay: Record<string, AiringSchedule[]> = {};
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  displayedSchedules.forEach((schedule) => {
    const date = convertUTCToLocal(schedule.airingAt);
    const dayKey = `${dayNames[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`;
    if (!groupedByDay[dayKey]) {
      groupedByDay[dayKey] = [];
    }
    groupedByDay[dayKey].push(schedule);
  });

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={24} className="text-orange-500" />
          <h2 className="text-2xl font-semibold">Your Shows This Week</h2>
          {totalCount > 0 && (
            <span className="text-sm text-gray-400">({totalCount} episodes)</span>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.entries(groupedByDay).map(([day, daySchedules]) => (
          <div key={day} className="bg-[#1a1d24] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-orange-400 mb-3 border-b border-gray-700 pb-2">
              {day}
            </h3>
            <div className="flex flex-col gap-3">
              {daySchedules.map((schedule) => {
                const title = getTitle(schedule);
                const time = convertUTCToLocal(schedule.airingAt);
                const timeString = time.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                });
                const timeUntil = formatTimeUntilAiring(schedule.airingAt);

                return (
                  <Link
                    key={schedule.id}
                    href={`/anime/${schedule.media.id}`}
                    className="flex gap-3 group"
                  >
                    <img
                      src={schedule.media.coverImage.extraLarge}
                      alt={title}
                      loading="lazy"
                      className="w-12 h-16 object-cover rounded bg-[#191d26] flex-shrink-0"
                    />
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="text-sm font-medium text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
                        {title}
                      </p>
                      <p className="text-xs text-gray-400">
                        Ep {schedule.episode}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={10} />
                        <span>
                          {timeString} ({timeUntil})
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Show "See more" when there are additional shows */}
      {remainingCount > 0 && (
        <div className="mt-4 text-center">
          <Link
            href="/calendar"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1d24] hover:bg-[#252a33] text-orange-400 rounded-lg transition-colors"
          >
            +{remainingCount} more episode{remainingCount > 1 ? "s" : ""} this week
            <ChevronRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default WatchlistAiring;
