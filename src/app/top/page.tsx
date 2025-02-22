import React from "react";
import AnimeDisplay from "@/components/AnimeDisplay";
import { animeSearch } from "../actions";

const page = async () => {
  const topResponse = await animeSearch({
    sort: ["SCORE_DESC"],
    page: 1,
  });
  const topAnime = topResponse.data.Page.media;

  if (!topAnime) {
    return <div>Loading...</div>;
  }

  return <div>{/* <AnimeDisplay anime */}</div>;
};

export default page;
