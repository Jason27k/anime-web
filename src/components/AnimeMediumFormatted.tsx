"use client";
import AnimeMediumResizable from "./Cards/AnimeCardMediumResizable";
import { AiringSchedule, MediaDisplay } from "@/utils/anilistTypes";

export const AnimeMediumFormatted = ({
  animeData,
  airingSchedules,
}: {
  animeData?: MediaDisplay[];
  airingSchedules?: AiringSchedule[];
}) => {
  return (
    <div className="grid grid-cols-1 min-[360px]:grid-cols-2 min-[600px]:grid-cols-3 min-[900px]:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-5 xl:gap-8 justify-center">
      {airingSchedules
        ? airingSchedules.map((schedule: AiringSchedule) => (
            <AnimeMediumResizable
              anime={schedule.media}
              key={schedule.media.id}
              airing={schedule.airingAt}
            />
          ))
        : animeData &&
          animeData.map((anime: MediaDisplay) => (
            <AnimeMediumResizable
              anime={anime}
              key={anime.id}
            />
          ))}
    </div>
  );
};
