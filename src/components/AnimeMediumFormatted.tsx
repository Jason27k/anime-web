"use client";
import AnimeCardMedium from "./Cards/AnimeCardMedium";
import AnimeMediumResizable from "./Cards/AnimeCardMediumResizable";
import { AiringSchedule, MediaDisplay } from "@/utils/anilistTypes";

export const AnimeMediumFormatted = ({
  scroll,
  animeData,
  airingSchedules,
  loggedIn,
  ids,
}: {
  scroll?: boolean;
  animeData?: MediaDisplay[];
  airingSchedules?: AiringSchedule[];
  loggedIn: boolean;
  ids: number[];
}) => {
  if (scroll) {
    return (
      <div
        className="flex gap-4 justify-center overflow-x-scroll w-full"
        key="scroll"
      >
        {airingSchedules
          ? airingSchedules.map((schedule: AiringSchedule) => (
              <AnimeCardMedium
                anime={schedule.media}
                key={schedule.media.id}
                airing={schedule.airingAt}
                loggedIn={loggedIn}
                ids={ids}
              />
            ))
          : animeData &&
            animeData.map((anime: MediaDisplay) => (
              <AnimeCardMedium
                anime={anime}
                key={anime.id}
                loggedIn={loggedIn}
                ids={ids}
              />
            ))}
      </div>
    );
  }
  return (
    <div
      className="grid grid-cols-2 min-[300px]:grid-cols-3 min-[600px]:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-5 xl:gap-8 justify-center"
      key="non-scroll"
    >
      {airingSchedules
        ? airingSchedules.map((schedule: AiringSchedule) => (
            <AnimeMediumResizable
              anime={schedule.media}
              key={schedule.media.id}
              airing={schedule.airingAt}
              loggedIn={loggedIn}
              ids={ids}
            />
          ))
        : animeData &&
          animeData.map((anime: MediaDisplay) => (
            <AnimeMediumResizable
              anime={anime}
              key={anime.id}
              loggedIn={loggedIn}
              ids={ids}
            />
          ))}
    </div>
  );
};
