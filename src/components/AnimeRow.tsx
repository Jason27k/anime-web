import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimeMediumResizable from "./Cards/AnimeCardMediumResizable";
import { MediaDisplay } from "@/utils/anilistTypes";

interface AnimeRowProps {
  title: string;
  animes: MediaDisplay[];
  link: string;
}

const AnimeRow = ({ title, animes, link }: AnimeRowProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
            {title}
          </h2>
          <div className="h-1 w-12 bg-primary rounded-full" />
        </div>
        <Link
          href={link}
          className="text-primary text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all"
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 min-[600px]:grid-cols-3 min-[900px]:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 xl:gap-6 justify-center">
        {animes &&
          animes
            .slice(0, 5)
            .map((anime: MediaDisplay) => (
              <AnimeMediumResizable
                key={anime.id}
                anime={anime}
              />
            ))}
        {animes[5] && (
          <AnimeMediumResizable
            anime={animes[5]}
            className="block md:hidden xl:block"
          />
        )}
      </div>
    </div>
  );
};

export default AnimeRow;
