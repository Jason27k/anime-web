import { Anime } from "@tutkli/jikan-ts";
import AnimeCardMedium from "./Cards/AnimeCardMedium";
import AnimeMediumResizable from "./Cards/AnimeCardMediumResizable";

export const AnimeMediumFormatted = ({
  animeData,
  scroll,
}: {
  animeData: Anime[];
  scroll?: boolean;
}) => {
  if (scroll) {
    return (
      <div
        className="flex gap-4 justify-center overflow-x-scroll w-full"
        key="scroll"
      >
        {animeData.map((anime: any) => (
          <AnimeCardMedium anime={anime} key={anime.id} />
        ))}
      </div>
    );
  }
  return (
    <div
      className="grid grid-cols-2 min-[670px]:grid-cols-3 md:grid-cols-5 xl:grid-cols-6 gap-10 justify-center"
      key="non-scroll"
    >
      {animeData.map((anime: any) => (
        <AnimeMediumResizable anime={anime} key={anime.id} />
      ))}
    </div>
  );
};
