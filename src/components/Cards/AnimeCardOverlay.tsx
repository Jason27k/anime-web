"use client";

import Link from "next/link";
import { AnimeCardData } from "@/utils/anilistTypes";
import { cn } from "@/lib/utils";

interface AnimeCardOverlayProps {
  anime: AnimeCardData;
  className?: string;
}

const AnimeCardOverlay = ({ anime, className }: AnimeCardOverlayProps) => {
  const title = anime.title.english ?? anime.title.romaji ?? anime.title.native;

  const studio = anime.studios?.nodes[0]?.name;
  const episodeInfo = anime.nextAiringEpisode
    ? `EP ${anime.nextAiringEpisode.episode}`
    : anime.episodes
    ? `${anime.episodes} EPS`
    : null;

  return (
    <Link
      href={`/anime/${anime.id}`}
      className={cn(
        "group relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg hover:ring-2 ring-primary/50 transition-all block",
        className
      )}
    >
      <img
        src={anime.coverImage.extraLarge}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent flex flex-col justify-end p-4 md:p-6">
        <h4 className="font-bold text-base md:text-lg mb-1 text-foreground line-clamp-2">
          {title}
        </h4>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider">
          {episodeInfo && (
            <span className="px-2 py-0.5 bg-primary/20 text-primary rounded">
              {episodeInfo}
            </span>
          )}
          {studio && <span>{studio}</span>}
        </div>
      </div>
    </Link>
  );
};

export default AnimeCardOverlay;
