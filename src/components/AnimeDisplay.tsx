import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import AnimeLongCard from "./Cards/AnimeLongCard";
import { AnimeMediumFormatted } from "./AnimeMediumFormatted";
import AnimeCard from "./Cards/AnimeCard";
import { Anime } from "@tutkli/jikan-ts";

const AnimeDisplay = ({
  animeData,
  display,
  scroll,
}: {
  animeData: any;
  display: number;
  scroll?: boolean;
}) => {
  return (
    <ScrollArea className="pt-2 flex justify-center w-full">
      <div className="flex flex-col items-center">
        <div className="">
          {display == 0 ? (
            <div className="flex flex-wrap gap-5 justify-center">
              {animeData.map((anime: Anime) => (
                <AnimeLongCard anime={anime} key={anime.mal_id} />
              ))}
            </div>
          ) : display == 1 && scroll ? (
            <div className="flex gap-4 justify-center">
              <AnimeMediumFormatted animeData={animeData} scroll={scroll} />
            </div>
          ) : display == 2 ? (
            <div className="flex justify-center">
              <AnimeMediumFormatted animeData={animeData} />
            </div>
          ) : (
            <div className="w-full">
              <div className="min-[465px]:hidden">
                <AnimeMediumFormatted animeData={animeData} />
              </div>
              <div className="hidden min-[465px]:grid w-full grid-cols-1 min-[975px]:grid-cols-2 min-[2000px]:grid-cols-3 gap-4 justify-center">
                {animeData.map((anime: Anime) => (
                  <AnimeCard anime={anime} key={anime.mal_id} />
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
