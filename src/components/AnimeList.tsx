"use client";

import { useState, useContext } from "react";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  PlayCircle,
  XCircle,
  LayoutGrid,
  Pencil,
} from "lucide-react";
import { Anime, Title } from "@/utils/myAnimeTypes";
import { convertUTCToLocal } from "@/utils/date";
import { capitalize } from "@/utils/formatting";
import Link from "next/link";
import { AnimeInfo } from "@/app/my-anime/page";
import AnimeSheet from "./AnimeSheet";
import { AnimeStatus } from "@/lib/api-client";
import { SettingsContext } from "@/app/Provider";

interface AnimeListProps {
  animeInfoList: AnimeInfo[];
  route: "all" | "watching" | "finished" | "dropped";
}

export default function AnimeList({ animeInfoList, route }: AnimeListProps) {
  const { settings } = useContext(SettingsContext);
  const [editingAnime, setEditingAnime] = useState<{
    id: number;
    title: string;
    episode: number | null;
    status: AnimeStatus;
    totalEpisodes: number | null;
    isAnimeFinishedAiring: boolean;
    coverImage: string;
  } | null>(null);

  function getTitle(title: Title): string {
    return title.english || title.romaji || title.userPreferred;
  }

  function timeOrSeasonString(anime: Anime) {
    if (!settings.showAiringTime) return null;

    if (anime.nextAiringEpisode && anime.nextAiringEpisode.airingAt) {
      const date = convertUTCToLocal(anime.nextAiringEpisode.airingAt);
      const days = [
        "Sundays", "Mondays", "Tuesdays", "Wednesdays",
        "Thursdays", "Fridays", "Saturdays",
      ];
      const dayString = days[date.getDay()] || "No time specified";
      const time = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
      });
      return `${dayString} at ${time}`;
    }
    const season = anime.season;
    const year = anime.seasonYear;
    return `${capitalize(season)} ${year}`;
  }

  const tabs = [
    { route: "all" as const, label: "All", icon: LayoutGrid, href: "/my-anime" },
    { route: "watching" as const, label: "Watching", icon: PlayCircle, href: "/my-anime/watching" },
    { route: "finished" as const, label: "Completed", icon: CheckCircle2, href: "/my-anime/finished" },
    { route: "dropped" as const, label: "Dropped", icon: XCircle, href: "/my-anime/dropped" },
  ];

  const getStatusFilter = (r: typeof route) => {
    switch (r) {
      case "watching": return "WATCHING";
      case "finished": return "COMPLETED";
      case "dropped": return "DROPPED";
      default: return null;
    }
  };

  const filteredList = animeInfoList.filter((animeInfo) => {
    const filter = getStatusFilter(route);
    return filter === null || animeInfo.status === filter;
  });

  const gridClasses = {
    compact: {
      small: "grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4",
      medium: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5",
      large: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
    },
    comfortable: {
      small: "grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4",
      medium: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5",
      large: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
    },
    spacious: {
      small: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5",
      medium: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
      large: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
    },
  };

  const currentGridClass = gridClasses[settings.gridDensity][settings.cardSize];

  return (
    <div className="space-y-8">
      {/* Underline Tab Navigation */}
      <div className="flex items-center gap-6 md:gap-8 border-b border-border overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = route === tab.route;
          return (
            <Link
              key={tab.route}
              href={tab.href}
              className={`flex items-center gap-2 pb-4 text-base font-semibold whitespace-nowrap transition-colors border-b -mb-px ${
                isActive
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Anime Grid */}
      {filteredList.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No anime in this category yet.</p>
        </div>
      ) : (
        <div className={`grid ${currentGridClass}`}>
          {filteredList.map((animeInfo: AnimeInfo) => {
            const progressPercent =
              animeInfo.status === "COMPLETED"
                ? 100
                : animeInfo.anime.episodes && animeInfo.episode
                ? (animeInfo.episode / animeInfo.anime.episodes) * 100
                : 0;

            const airingInfo = timeOrSeasonString(animeInfo.anime);
            const displayTitle = getTitle(animeInfo.anime.title);

            const openEdit = () =>
              setEditingAnime({
                id: animeInfo.anime.id,
                title: displayTitle,
                episode: animeInfo.episode,
                status: animeInfo.status,
                totalEpisodes: animeInfo.anime.episodes,
                isAnimeFinishedAiring: animeInfo.anime.nextAiringEpisode === null,
                coverImage: animeInfo.anime.coverImage.extraLarge,
              });

            return (
              <div key={animeInfo.anime.id} className="group flex flex-col gap-3">
                {/* Cover Image */}
                <div
                  className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface-container-low shadow-xl transition-transform duration-300 group-hover:scale-[1.03] group-hover:shadow-primary/10 cursor-pointer"
                  onClick={openEdit}
                >
                  <img
                    src={animeInfo.anime.coverImage.extraLarge}
                    alt={displayTitle}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Edit icon on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-primary p-1.5 rounded-full text-primary-foreground shadow-lg">
                      <Pencil className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Episode progress bar */}
                  {settings.showEpisodeProgress &&
                    animeInfo.anime.episodes &&
                    animeInfo.anime.episodes > 1 && (
                      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
                        <Progress value={progressPercent} className="h-1 rounded-none" />
                      </div>
                    )}
                </div>

                {/* Info below image */}
                <div className="flex flex-col gap-1">
                  <Link href={"/anime/" + animeInfo.anime.id}>
                    <h3
                      className="font-bold text-foreground line-clamp-1 leading-tight group-hover:text-primary transition-colors text-sm"
                      title={displayTitle}
                    >
                      {displayTitle}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between">
                    {animeInfo.anime.episodes ? (
                      <span className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase">
                        {animeInfo.episode || 1}/{animeInfo.anime.episodes} EPS
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">—</span>
                    )}
                  </div>

                  {airingInfo && (
                    <p className="text-xs text-muted-foreground">{airingInfo}</p>
                  )}

                  {/* Status label on "all" tab */}
                  {route === "all" && (
                    <span
                      className={`text-[10px] uppercase font-bold tracking-widest ${
                        animeInfo.status === "WATCHING"
                          ? "text-primary"
                          : animeInfo.status === "COMPLETED"
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {animeInfo.status === "WATCHING"
                        ? "Watching"
                        : animeInfo.status === "COMPLETED"
                        ? "Completed"
                        : "Dropped"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Sheet */}
      {editingAnime && (
        <AnimeSheet
          open={!!editingAnime}
          onOpenChange={(open) => !open && setEditingAnime(null)}
          animeId={editingAnime.id}
          animeTitle={editingAnime.title}
          currentEpisode={editingAnime.episode}
          currentStatus={editingAnime.status}
          totalEpisodes={editingAnime.totalEpisodes}
          isAnimeFinishedAiring={editingAnime.isAnimeFinishedAiring}
          coverImage={editingAnime.coverImage}
          isInList={true}
        />
      )}
    </div>
  );
}
