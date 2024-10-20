import React from "react";
import { fetchTopAnime } from "../actions";
import AnimeDisplay from "@/components/AnimeDisplay";

const page = async () => {
  const top = await fetchTopAnime(1, undefined);
  const topAnime = top?.data;

  if (!topAnime) {
    return <div>Loading...</div>;
  }

  return <div>{/* <AnimeDisplay anime */}</div>;
};

export default page;
