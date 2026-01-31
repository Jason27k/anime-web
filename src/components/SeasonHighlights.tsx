"use client";

import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";
import { MediaDisplay } from "@/utils/anilistTypes";
import AnimeMediumResizable from "./Cards/AnimeCardMediumResizable";

interface SeasonHighlightsProps {
  anime: MediaDisplay[];
  currentSeason: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  currentSeasonYear: number;
  loggedIn: boolean;
  ids: number[];
}

const seasonLabels: Record<string, string> = {
  WINTER: "Winter",
  SPRING: "Spring",
  SUMMER: "Summer",
  FALL: "Fall",
};

const SeasonHighlights = ({
  anime,
  currentSeason,
  currentSeasonYear,
  loggedIn,
  ids,
}: SeasonHighlightsProps) => {
  const topAnime = anime.slice(0, 4);

  if (topAnime.length === 0) {
    return null;
  }

  const seasonLabel = seasonLabels[currentSeason];

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={24} className="text-orange-500" />
          <h2 className="text-2xl font-semibold">
            {seasonLabel} {currentSeasonYear} Highlights
          </h2>
        </div>
        <Link
          href={`/search?season=${currentSeason}&year=${currentSeasonYear}`}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-orange-400 transition-colors"
        >
          See All
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {topAnime.map((item) => (
          <AnimeMediumResizable
            key={item.id}
            anime={item}
            loggedIn={loggedIn}
            ids={ids}
          />
        ))}
      </div>
    </div>
  );
};

export default SeasonHighlights;
