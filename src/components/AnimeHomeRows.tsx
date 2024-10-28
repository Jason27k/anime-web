"use client";

import { useState } from "react";
import TabOptions from "@/components/TabOptions";
import AnimeRow from "./AnimeRow";
import { MediaDisplay } from "@/utils/anilistTypes";

interface AnimeHomeRowsProps {
  upcoming: MediaDisplay[];
  trending: MediaDisplay[];
  popular: MediaDisplay[];
  top: MediaDisplay[];
}

const AnimeHomeRows = ({
  upcoming,
  trending,
  popular,
  top,
}: AnimeHomeRowsProps) => {
  const [display, setDisplay] = useState<0 | 1 | 2 | 3>(3);

  return (
    <div>
      <TabOptions
        display={display}
        setDisplay={setDisplay}
        scroll={false}
        className="pb-2"
      />
      <div className="flex flex-col gap-4 pt-2">
        <AnimeRow title="Top" animes={top} link="/top" />
        <AnimeRow title="Trending" animes={trending} link="/trending" />
        <AnimeRow title="Upcoming" animes={upcoming} link="/upcoming" />
        <AnimeRow title="Popular" animes={popular} link="/popular" />
      </div>
    </div>
  );
};

export default AnimeHomeRows;
