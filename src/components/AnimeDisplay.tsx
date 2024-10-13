import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import AnimeSmall from "./Calendar/AnimeSmall";
import { AnimeMediumFormatted } from "./AnimeMediumFormatted";
import AnimeCard from "./Cards/AnimeCard";

const AnimeDisplay = ({
  animeData,
  display,
  scroll,
  showDay,
}: {
  animeData: any;
  display: number;
  scroll?: boolean;
  showDay?: boolean;
}) => {
  return (
    <ScrollArea className="pt-2 flex justify-center w-full">
      <div className="flex flex-col items-center">
        <div className="">
          {display == 0 ? (
            <div className="flex flex-wrap gap-5 justify-center bg-orange-700">
              <AnimeSmall
                animeData={animeData}
                showDay={showDay ? showDay : false}
              />
            </div>
          ) : display == 1 && scroll ? (
            <div className="flex gap-4 justify-center">
              <AnimeMediumFormatted
                animeData={animeData}
                scroll={scroll}
                showDay={showDay ? showDay : false}
              />
            </div>
          ) : display == 2 ? (
            <div className="flex justify-center">
              <AnimeMediumFormatted
                animeData={animeData}
                showDay={showDay ? showDay : false}
              />
            </div>
          ) : (
            <div className="w-full">
              <div className="min-[465px]:hidden">
                <AnimeMediumFormatted
                  animeData={animeData}
                  showDay={showDay ? showDay : false}
                />
              </div>
              <div className="hidden min-[465px]:grid w-full grid-cols-1 min-[975px]:grid-cols-2 min-[2000px]:grid-cols-3 gap-4 justify-center">
                {animeData.map((anime: any) => (
                  <AnimeCard
                    anime={anime}
                    key={anime.mal_id}
                    showDay={showDay ? true : false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default AnimeDisplay;
