import React from "react";
import { fetchSeasonalAnime } from "./actions";
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

  const response = await fetchSeasonalAnime(year, nextSeason, 1);
  const upcoming = response?.data;

  if (!upcoming) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AnimeHomeRows
        upcoming={upcoming}
        top={upcoming}
        trending={upcoming}
        popular={upcoming}
      />
    </div>
  );
};

export default page;
