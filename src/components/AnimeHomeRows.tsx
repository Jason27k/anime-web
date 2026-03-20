import AnimeRow from "./AnimeRow";
import AnimeCardOverlay from "./Cards/AnimeCardOverlay";
import Link from "next/link";
import { MediaDisplay } from "@/utils/anilistTypes";

interface AnimeHomeRowsProps {
  upcoming: MediaDisplay[];
  trending: MediaDisplay[];
  popular: MediaDisplay[];
  top: MediaDisplay[];
  romance: MediaDisplay[];
  nextSeason: string;
  nextSeasonYear: number;
  currentSeason?: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  currentSeasonYear?: number;
  loggedIn: boolean;
  ids: number[];
}

const seasonLabels: Record<string, string> = {
  WINTER: "Winter",
  SPRING: "Spring",
  SUMMER: "Summer",
  FALL: "Fall",
};

const AnimeHomeRows = ({
  upcoming,
  trending,
  popular,
  top,
  nextSeason,
  nextSeasonYear,
  currentSeason,
  currentSeasonYear,
  loggedIn,
  ids,
}: AnimeHomeRowsProps) => {
  const nextSeasonLabel = seasonLabels[nextSeason] ?? nextSeason;

  return (
    <div className="flex flex-col gap-16">
      <AnimeRow
        title="Top All Time"
        animes={top}
        link="/search?sort=SCORE_DESC"
        loggedIn={loggedIn}
        ids={ids}
      />

      <AnimeRow
        title="Most Popular"
        animes={popular}
        link="/search?sort=POPULARITY_DESC"
        loggedIn={loggedIn}
        ids={ids}
      />

      {/* Upcoming season highlights — mirrored layout (text right) */}
      {upcoming.length > 0 && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left cards panel */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {upcoming.slice(0, 3).map((item, index) => (
              <AnimeCardOverlay
                key={item.id}
                anime={item}
                className={index === 2 ? "hidden md:block" : undefined}
              />
            ))}
          </div>

          {/* Right text panel */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <span className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-2">
              {nextSeasonLabel} {nextSeasonYear}
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3 leading-tight text-foreground">
              Coming <br />Soon
            </h2>
            <p className="text-muted-foreground mb-5 max-w-sm leading-relaxed">
              A preview of the most anticipated anime arriving next season.
            </p>
            <Link
              href={`/search?year=${nextSeasonYear}&season=${nextSeason}`}
              className="w-fit bg-surface-container-high hover:bg-surface-container-highest text-foreground px-6 py-2.5 rounded-full border border-outline-variant/20 transition-all font-bold text-sm uppercase tracking-widest"
            >
              Explore Upcoming
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default AnimeHomeRows;
