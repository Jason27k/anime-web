"use client";
import { ScrollArea } from "./ui/scroll-area";
import { AiringSchedule, MediaDisplay } from "@/utils/anilistTypes";
import AnimeCard from "./Cards/AnimeCard";

const AnimeDisplay = ({
  animeData,
  airingSchedules,
  loggedIn,
  ids,
}: {
  animeData?: MediaDisplay[];
  airingSchedules?: AiringSchedule[];
  loggedIn: boolean;
  ids: number[];
}) => {
  if (!airingSchedules && !animeData) {
    return <></>;
  }

  return (
    <ScrollArea className="pt-2 flex justify-center w-full">
      <div className="w-full">
        <div className="grid w-full grid-cols-2 min-[600px]:grid-cols-3 min-[900px]:grid-cols-4 min-[1200px]:grid-cols-5 xl:grid-cols-6 gap-4">
          {airingSchedules
            ? airingSchedules.map((schedule) => (
                <AnimeCard
                  anime={schedule.media}
                  key={schedule.media.id}
                  airing={schedule.airingAt}
                  loggedIn={loggedIn}
                  ids={ids}
                />
              ))
            : animeData &&
              animeData.map((anime: MediaDisplay) => (
                <AnimeCard
                  anime={anime}
                  key={anime.id}
                  loggedIn={loggedIn}
                  ids={ids}
                />
              ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default AnimeDisplay;
