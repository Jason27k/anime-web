"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MediaDisplay } from "@/utils/anilistTypes";
import AnimeCardOverlay from "./Cards/AnimeCardOverlay";

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
}: SeasonHighlightsProps) => {
  const topAnime = anime.slice(0, 3);

  if (topAnime.length === 0) {
    return null;
  }

  const seasonLabel = seasonLabels[currentSeason];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Left text panel */}
      <div className="lg:col-span-4 flex flex-col justify-center">
        <span className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-2">
          {seasonLabel} {currentSeasonYear}
        </span>
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3 leading-tight text-foreground">
          Seasonal <br />Favorites
        </h2>
        <p className="text-muted-foreground mb-5 max-w-sm leading-relaxed">
          The highest rated anime from this season&apos;s collection. Curated from the
          current airing lineup.
        </p>
        <Link
          href={`/search?season=${currentSeason}&year=${currentSeasonYear}&sort=TRENDING_DESC`}
          className="w-fit bg-surface-container-high hover:bg-surface-container-highest text-foreground px-6 py-2.5 rounded-full border border-outline-variant/20 transition-all font-bold text-sm uppercase tracking-widest"
        >
          Explore Seasonal Chart
        </Link>
      </div>

      {/* Right cards panel */}
      <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {topAnime.map((item, index) => (
          <AnimeCardOverlay
            key={item.id}
            anime={item}
            className={index === 2 ? "hidden md:block" : undefined}
          />
        ))}
      </div>
    </section>
  );
};

export default SeasonHighlights;
