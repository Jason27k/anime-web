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
}: {
  display: number;
  scroll?: boolean;
  animeData?: MediaDisplay[];
  airingSchedules?: AiringSchedule[];
}) => {
  if (!airingSchedules && !animeData) {
    return <></>;
  }

  return (
    <ScrollArea className="pt-2 flex justify-center w-full">
      <div className="flex flex-col items-center">
        <div className="">
          {display == 0 ? (
            <div className="flex flex-wrap gap-5 justify-center">
              {airingSchedules
                ? airingSchedules.map((schedule) => (
                    <AnimeLongCard
                      anime={schedule.media}
                      key={schedule.media.id}
                      airing={schedule.airingAt}
                    />
                  ))
                : animeData &&
                  animeData.map((anime: MediaDisplay) => (
                    <AnimeLongCard anime={anime} key={anime.id} />
                  ))}
            </div>
          ) : display == 1 && scroll ? (
            <>
              <div className="flex gap-4 justify-center overflow-x-scroll w-full">
                <AnimeMediumFormatted
                  scroll={scroll}
                  airingSchedules={airingSchedules}
                  animeData={animeData}
                />
              </div>
              <ScrollBar orientation="horizontal" />
            </>
          ) : display == 2 ? (
            <div className="flex justify-center">
              <AnimeMediumFormatted
                airingSchedules={airingSchedules}
                animeData={animeData}
              />
            </div>
          ) : (
            <div className="w-full">
              <div className="min-[465px]:hidden">
                <AnimeMediumFormatted
                  airingSchedules={airingSchedules}
                  animeData={animeData}
                />
              </div>
              <div className="hidden min-[465px]:grid w-full grid-cols-1 min-[975px]:grid-cols-2 min-[2000px]:grid-cols-3 gap-4 justify-center">
                {airingSchedules
                  ? airingSchedules.map((schedule) => (
                      <AnimeCard
                        anime={schedule.media}
                        key={schedule.media.id}
                        airing={schedule.airingAt}
                      />
                    ))
                  : animeData &&
                    animeData.map((anime: MediaDisplay) => (
                      <AnimeCard anime={anime} key={anime.id} />
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
