import { Anime } from "@tutkli/jikan-ts";
import Link from "next/link";
import AnimeCardMediumTwo from "./Cards/AnimeCardMediumTwo";

interface AnimeRowProps {
  title: string;
  animes: Anime[];
  link: string;
}

const AnimeRow = ({ title, animes, link }: AnimeRowProps) => {
  return (
    <>
      <div className="flex flex-col text-white">
        <div className="flex justify-between">
          <h1>{title}</h1>
          <Link href={link}>View All</Link>
        </div>
        <div className="grid grid-cols-1 min-[395px]:content-normal min-[395px]:grid-cols-2 min-[670px]:grid-cols-3 md:grid-cols-5 xl:grid-cols-6 gap-10 justify-center">
          {animes &&
            animes
              .slice(0, 5)
              .map((anime: Anime) => (
                <AnimeCardMediumTwo key={anime.mal_id} anime={anime} />
              ))}
          <AnimeCardMediumTwo
            anime={animes[6]}
            className="block md:hidden xl:block"
          />
        </div>
      </div>
    </>
  );
};

export default AnimeRow;
