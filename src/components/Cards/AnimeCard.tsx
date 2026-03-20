"use client";

import { CirclePlus, Pencil, Star, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MediaDisplay } from "@/utils/anilistTypes";
import { convertUTCToLocal } from "@/utils/date";
import AnimeSheet from "../AnimeSheet";

interface AnimeCardProps {
  anime: MediaDisplay;
  airing?: number;
  loggedIn: boolean;
  ids: number[];
}

const AnimeCard = ({ anime, airing, loggedIn, ids }: AnimeCardProps) => {
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [isInList, setIsInList] = useState(ids.includes(anime.id));

  const image = anime.coverImage.extraLarge;
  const title = anime.title.english ?? anime.title.romaji ?? anime.title.native;

  let airingLabel = "";
  if (airing) {
    const date = convertUTCToLocal(airing);
    airingLabel = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  } else if (anime.nextAiringEpisode) {
    const date = convertUTCToLocal(anime.nextAiringEpisode.airingAt);
    airingLabel = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  }

  const score =
    anime.averageScore === null || !anime.averageScore
      ? null
      : anime.averageScore / 10;
  const members = anime.popularity;

  return (
    <div className="flex flex-col group cursor-pointer relative w-full max-w-[200px] mx-auto">
      <Link href={"/anime/" + anime.id}>
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-surface-container-low mb-3 transition-transform duration-500 hover:scale-[1.03] shadow-lg hover:shadow-primary/10">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          {airingLabel && (
            <span
              className="absolute top-2 left-2 text-white text-xs font-black tracking-tighter px-2 py-1 rounded"
              style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
            >
              {airingLabel}
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
        <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors mb-1 line-clamp-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-0.5">
          {anime.studios.nodes[0]?.name ?? ""}
        </p>
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

      {loggedIn && (
        <div className="mt-1 flex justify-end">
          {isInList ? (
            <Pencil
              size={14}
              className="text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={() => setAddSheetOpen(true)}
            />
          ) : (
            <CirclePlus
              size={16}
              className="text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={() => setAddSheetOpen(true)}
            />
          )}
          <AnimeSheet
            open={addSheetOpen}
            onOpenChange={setAddSheetOpen}
            animeId={anime.id}
            animeTitle={title}
            totalEpisodes={anime.episodes}
            coverImage={anime.coverImage.extraLarge}
            isInList={isInList}
            onSuccess={(action) => {
              setIsInList(action === "added" || action === "updated");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AnimeCard;
