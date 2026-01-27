"use client";
import { ScrollArea } from "./ui/scroll-area";
import { AiringSchedule, MediaDisplay } from "@/utils/anilistTypes";
import AnimeCard from "./Cards/AnimeCard";
import { AnimeMediumFormatted } from "./AnimeMediumFormatted";

const AnimeDisplay = ({
  display,
  animeData,
  airingSchedules,
  loggedIn,
  ids,
}: {
  display: number;
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
      <div className="flex flex-col items-center justify-center overflow-x-auto overflow-y-clip h-full w-full">
        <div className="w-full mx-auto">
          {display == 0 ? (
            <div className="flex justify-center">
              <AnimeMediumFormatted
                airingSchedules={airingSchedules}
                animeData={animeData}
                loggedIn={loggedIn}
                ids={ids}
              />
            </div>
          ) : (
            <div className="w-full">
              <div className="min-[465px]:hidden">
                <AnimeMediumFormatted
                  airingSchedules={airingSchedules}
                  animeData={animeData}
                  loggedIn={loggedIn}
                  ids={ids}
                />
              </div>
              <div className="hidden min-[465px]:grid w-full grid-cols-1 min-[975px]:grid-cols-2 min-[2000px]:grid-cols-3 gap-4 justify-center">
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
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default AnimeDisplay;
