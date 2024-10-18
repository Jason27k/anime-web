import { Anime } from "@tutkli/jikan-ts";
import AnimeCardMedium from "./Cards/AnimeCardMedium";

export const AnimeMediumFormatted = ({
  animeData,
  scroll,
  showDay,
}: {
  animeData: Anime[];
  scroll?: boolean;
  showDay: boolean;
}) => {
  if (scroll) {
    return (
      <div className="flex gap-4 justify-center" key="scroll">
        {animeData.map((anime: any) => (
          <AnimeCardMedium anime={anime} key={anime.id} showDay={showDay} />
        ))}
      </div>
    );
  }
  return (
    <div
      className="flex flex-wrap gap-3 justify-center w-full"
      key="non-scroll"
    >
      {animeData.map((anime: any) => (
        <AnimeCardMedium anime={anime} key={anime.id} showDay={showDay} />
      ))}
    </div>
  );
};
