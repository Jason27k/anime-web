"use client";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AiringSchedule, MediaDisplay } from "@/utils/anilistTypes";
import AnimeLongCard from "./Cards/AnimeLongCard";
import AnimeCard from "./Cards/AnimeCard";
import { AnimeMediumFormatted } from "./AnimeMediumFormatted";

const AnimeDisplay = ({
  display,
  scroll,
  animeData,
  airingSchedules,
  loggedIn,
  ids,
}: {
  display: number;
  scroll?: boolean;
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
            <div className="grid w-full grid-cols-1 min-[725px]:grid-cols-2 min-[1120px]:grid-cols-3 min-[2000px]:grid-cols-4 min-[3120px]:grid-cols-5 gap-5 justify-center justify-self-center mx-auto">
              {airingSchedules
                ? airingSchedules.map((schedule) => (
                    <AnimeLongCard
                      anime={schedule.media}
                      key={schedule.media.id}
                      airing={schedule.airingAt}
                      loggedIn={loggedIn}
                      ids={ids}
                    />
                  ))
                : animeData &&
                  animeData.map((anime: MediaDisplay) => (
                    <AnimeLongCard
                      anime={anime}
                      key={anime.id}
                      loggedIn={loggedIn}
                      ids={ids}
                    />
                  ))}
            </div>
          ) : display == 1 && scroll ? (
            <>
              <div className="flex gap-4 justify-center overflow-x-scroll w-full">
                <AnimeMediumFormatted
                  scroll={scroll}
                  airingSchedules={airingSchedules}
                  animeData={animeData}
                  loggedIn={loggedIn}
                  ids={ids}
                />
              </div>
              <ScrollBar orientation="horizontal" />
            </>
          ) : display == 2 ? (
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
