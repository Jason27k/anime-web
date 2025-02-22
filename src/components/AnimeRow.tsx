import Link from "next/link";
import AnimeMediumResizable from "./Cards/AnimeCardMediumResizable";
import { MediaDisplay } from "@/utils/anilistTypes";

interface AnimeRowProps {
  title: string;
  animes: MediaDisplay[];
  link: string;
  loggedIn: boolean;
  ids: number[];
}

const AnimeRow = ({ title, animes, link, loggedIn, ids }: AnimeRowProps) => {
  return (
    <>
      <div className="flex flex-col text-white gap-2">
        <div className="flex justify-between">
          <h1 className="text-2xl">{title}</h1>
          <Link href={link}>View All</Link>
        </div>
        <div className="grid grid-cols-2 min-[300px]:grid-cols-3 min-[600px]:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 xl:gap-8 2xl:gap-10 justify-center">
          {animes &&
            animes
              .slice(0, 5)
              .map((anime: MediaDisplay) => (
                <AnimeMediumResizable
                  key={anime.id}
                  anime={anime}
                  loggedIn={loggedIn}
                  ids={ids}
                />
              ))}
          <AnimeMediumResizable
            anime={animes[6]}
            className="block md:hidden xl:block"
            loggedIn={loggedIn}
            ids={ids}
          />
        </div>
      </div>
    </>
  );
};

export default AnimeRow;
