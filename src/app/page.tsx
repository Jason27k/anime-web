import React from "react";
import { animeSearch } from "./actions";
import AnimeHomeRows from "@/components/AnimeHomeRows";

const page = async () => {
  let year = new Date().getFullYear();
  let nextSeasonYear = year;
  const month = new Date().getMonth();
  let nextSeason: "WINTER" | "SPRING" | "SUMMER" | "FALL" = "WINTER";
  let currentSeason: "WINTER" | "SPRING" | "SUMMER" | "FALL" = "FALL";

  if (month >= 0 && month < 3) {
    nextSeason = "SPRING";
    currentSeason = "WINTER";
  } else if (month >= 3 && month < 6) {
    nextSeason = "SUMMER";
    currentSeason = "SPRING";
  } else if (month >= 6 && month < 9) {
    nextSeason = "FALL";
    currentSeason = "SUMMER";
  } else {
    nextSeasonYear += 1;
  }

  const upcomingResponse = await animeSearch({
    seasonYear: nextSeasonYear,
    season: nextSeason,
    page: 1,
  });

  const trendingResponse = await animeSearch({
    seasonYear: year,
    season: currentSeason,
    sort: ["TRENDING_DESC"],
    page: 1,
  });

  const popularResponse = await animeSearch({
    sort: ["POPULARITY_DESC"],
    page: 1,
  });
  const topResponse = await animeSearch({
    sort: ["SCORE_DESC"],
    page: 1,
  });

  const upcoming = upcomingResponse?.data.Page.media;
  const trending = trendingResponse?.data.Page.media;
  const popular = popularResponse?.data.Page.media;
  const top = topResponse?.data.Page.media;

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
