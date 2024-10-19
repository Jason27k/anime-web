import React from "react";
import { fetchSeasonalAnime, fetchTopAnime } from "./actions";
import AnimeHomeRows from "@/components/AnimeHomeRows";

const page = async () => {
  let year = new Date().getFullYear();
  const month = new Date().getMonth();
  let nextSeason: "winter" | "spring" | "summer" | "fall" = "winter";

  if (month >= 0 && month < 3) {
    nextSeason = "spring";
  } else if (month >= 3 && month < 6) {
    nextSeason = "summer";
  } else if (month >= 6 && month < 9) {
    nextSeason = "fall";
  } else {
    year += 1;
  }

  const upcomingResponse = await fetchSeasonalAnime(year, nextSeason, 1);
  const trendingResponse = await fetchTopAnime(1, "airing");
  const popularResponse = await fetchTopAnime(1, "bypopularity");
  const topResponse = await fetchTopAnime(1, undefined);

  const upcoming = upcomingResponse?.data;
  const trending = trendingResponse?.data;
  const popular = popularResponse?.data;
  const top = topResponse?.data;

  if (!upcoming || !trending || !popular || !top) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AnimeHomeRows
        upcoming={upcoming}
        top={top}
        trending={trending}
        popular={popular}
      />
    </div>
  );
};

export default page;
