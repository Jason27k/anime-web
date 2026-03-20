"use client";

import Link from "next/link";
import { MediaDisplay } from "@/utils/anilistTypes";
import { cn } from "@/lib/utils";

interface AnimeCardSimpleProps {
  anime: MediaDisplay;
  subtitle?: string;
  className?: string;
}

const AnimeCardSimple = ({ anime, subtitle, className }: AnimeCardSimpleProps) => {
  const title = anime.title.english ?? anime.title.romaji ?? anime.title.native;

  const studioName = anime.studios?.nodes[0]?.name;

  return (
    <Link
      href={`/anime/${anime.id}`}
      className={cn("flex-none w-40 group block", className)}
    >
      <div className="aspect-[2/3] bg-surface-container rounded-lg mb-3 overflow-hidden">
        <img
          src={anime.coverImage.extraLarge}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
        />
      </div>
      <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
        {title}
      </h4>
      <p className="text-[10px] text-muted-foreground truncate">
        {subtitle ?? studioName ?? ""}
      </p>
    </Link>
  );
};

export default AnimeCardSimple;
