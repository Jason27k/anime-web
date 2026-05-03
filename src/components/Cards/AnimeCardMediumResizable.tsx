"use client";
import { Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AnimeCardData } from "@/utils/anilistTypes";
import { convertUTCToLocal } from "@/utils/date";

interface AnimeMediumResizableProps {
  anime: AnimeCardData;
  className?: string;
  airing?: number;
}

const AnimeMediumResizable = ({
  anime,
  className,
  airing,
}: AnimeMediumResizableProps) => {
  const image = anime.coverImage.extraLarge;
  const title = anime.title.english ?? anime.title.romaji ?? anime.title.native;

  let airingString = "";
  if (airing) {
    const date = convertUTCToLocal(airing);
    airingString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  }

  const score =
    anime.averageScore === null || !anime.averageScore
      ? null
      : anime.averageScore / 10;
  const members = anime.popularity ?? 0;

  return (
    <Link
      href={"/anime/" + anime.id}
      className={cn(className, "flex flex-col group cursor-pointer w-full min-w-0")}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-surface-container-low mb-3 transition-transform duration-500 hover:scale-[1.03] shadow-lg hover:shadow-primary/10">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {airingString && (
          <span
            className="absolute top-2 left-2 text-white text-xs font-black tracking-tighter px-2 py-1 rounded"
            style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          >
            {airingString}
          </span>
        )}
        {score && (
          <div
            className="absolute bottom-2 right-2 flex items-center gap-1 text-primary px-2 py-1 rounded"
            style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          >
            <Star size={11} fill="currentColor" />
            <span className="text-xs font-black">{score}</span>
          </div>
        )}
      </div>
      <h2 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors mb-1 line-clamp-2">
        {title}
      </h2>
      <div className="flex items-center justify-between text-muted-foreground text-xs uppercase tracking-wider">
        <div className="flex items-center gap-1">
          <Users size={12} />
          <span>
            {members > 1000000
              ? Math.floor(members / 100000) / 10 + "M"
              : Math.floor(members / 1000) + "K"}
          </span>
        </div>
        {anime.nextAiringEpisode ? (
          <span>EP {anime.nextAiringEpisode.episode}</span>
        ) : anime.episodes ? (
          <span>{anime.episodes} EPS</span>
        ) : null}
      </div>
    </Link>
  );
};

export default AnimeMediumResizable;
