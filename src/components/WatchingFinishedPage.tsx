"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  PlayCircle,
  XCircle,
  LayoutGrid,
} from "lucide-react";
import { Anime, Title } from "@/utils/myAnimeTypes";
import { convertUTCToLocal } from "@/utils/date";
import { capitalize } from "@/utils/formatting";
import Link from "next/link";
import { AnimeInfo } from "@/app/my-anime/page";
import AnimeSheet from "./AnimeSheet";
import { AnimeStatus } from "@/lib/api-client";

interface MyAnimeProps {
  animeInfoList: AnimeInfo[];
  route: "all" | "watching" | "finished" | "dropped";
  stats?: {
    watching: number;
    completed: number;
    dropped: number;
    total: number;
  };
}

export default function MyAnimePage({
  animeInfoList,
  route,
  stats,
}: MyAnimeProps) {
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
    if (anime.nextAiringEpisode && anime.nextAiringEpisode.airingAt) {
      const date = convertUTCToLocal(anime.nextAiringEpisode.airingAt);
      const days = [
        "Sundays",
        "Mondays",
        "Tuesdays",
        "Wednesdays",
        "Thursdays",
        "Fridays",
        "Saturdays",
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
    {
      route: "watching" as const,
      label: "Watching",
      icon: PlayCircle,
      href: "/my-anime/watching",
    },
    {
      route: "finished" as const,
      label: "Completed",
      icon: CheckCircle2,
      href: "/my-anime/finished",
    },
    {
      route: "dropped" as const,
      label: "Dropped",
      icon: XCircle,
      href: "/my-anime/dropped",
    },
  ];

  const getStatusFilter = (r: typeof route) => {
    switch (r) {
      case "watching":
        return "WATCHING";
      case "finished":
        return "COMPLETED";
      case "dropped":
        return "DROPPED";
      default:
        return null;
    }
  };

  const filteredList = animeInfoList.filter((animeInfo) => {
    const filter = getStatusFilter(route);
    return filter === null || animeInfo.status === filter;
  });

  return (
    <div className="space-y-6">
      {stats && (
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>{stats.watching} Watching</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>{stats.completed} Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-500" />
            <span>{stats.dropped} Dropped</span>
          </div>
          <div className="text-white font-medium">
            {stats.total} Total
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = route === tab.route;
          return (
            <Button
              key={tab.route}
              className={`${
                isActive
                  ? "bg-primary text-white"
                  : "bg-[#1f1f1f] text-primary hover:bg-[#2a2a2a]"
              }`}
              asChild
            >
              <Link href={tab.href}>
                <Icon className="mr-2 h-4 w-4" />
                {tab.label}
              </Link>
            </Button>
          );
        })}
      </div>

      {filteredList.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No anime in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredList.map((animeInfo: AnimeInfo) => {
            const progressPercent =
              animeInfo.status === "COMPLETED"
                ? 100
                : animeInfo.anime.episodes && animeInfo.episode
                ? (animeInfo.episode / animeInfo.anime.episodes) * 100
                : 0;

            const displayTitle = getTitle(animeInfo.anime.title);

            return (
              <Card
                key={animeInfo.anime.id}
                className="overflow-hidden border-0 bg-[#1f232d] flex flex-col group"
              >
                <div className="relative w-full aspect-[3/4]">
                  <button
                    onClick={() =>
                      setEditingAnime({
                        id: animeInfo.anime.id,
                        title: displayTitle,
                        episode: animeInfo.episode,
                        status: animeInfo.status,
                        totalEpisodes: animeInfo.anime.episodes,
                        isAnimeFinishedAiring: animeInfo.anime.nextAiringEpisode === null,
                        coverImage: animeInfo.anime.coverImage.extraLarge,
                      })
                    }
                    className="w-full h-full cursor-pointer"
                  >
                    <img
                      src={animeInfo.anime.coverImage.extraLarge}
                      alt={displayTitle}
                      className="object-cover h-full w-full transition-opacity group-hover:opacity-80"
                    />
                  </button>
                  <Badge
                    className="absolute top-2 right-2 flex items-center gap-1 border-0 text-white shadow-md !bg-orange-500 hover:!bg-orange-500"
                  >
                    {animeInfo.status === "WATCHING" ? (
                      <><PlayCircle className="h-3 w-3" /> Watching</>
                    ) : animeInfo.status === "COMPLETED" ? (
                      <><CheckCircle2 className="h-3 w-3" /> Completed</>
                    ) : (
                      <><XCircle className="h-3 w-3" /> Dropped</>
                    )}
                  </Badge>

                  {/* Progress Bar */}
                  {animeInfo.anime.episodes &&
                    animeInfo.anime.episodes > 1 && (
                      <div className="absolute bottom-0 left-0 right-0">
                        <Progress value={progressPercent} className="h-1 rounded-none" />
                      </div>
                    )}
                </div>

                <CardContent className="p-3 flex-1">
                  <h2
                    className="font-semibold text-sm mb-1 line-clamp-2 text-white leading-tight"
                    title={displayTitle}
                  >
                    {displayTitle}
                  </h2>
                  {animeInfo.anime.episodes && (
                    <p className="text-xs text-muted-foreground">
                      Ep {animeInfo.episode || 1} / {animeInfo.anime.episodes}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {timeOrSeasonString(animeInfo.anime)}
                  </p>
                </CardContent>

                <CardFooter className="p-3 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white"
                    asChild
                  >
                    <Link href={"/anime/" + animeInfo.anime.id}>
                      {animeInfo.status === "WATCHING"
                        ? "Continue"
                        : animeInfo.status === "COMPLETED"
                        ? "Details"
                        : "View"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {editingAnime && (
        <AnimeSheet
          open={!!editingAnime}
          onOpenChange={(open: boolean) => !open && setEditingAnime(null)}
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
