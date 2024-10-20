"use client";
import AnimeDay from "./AnimeDay";
import { Anime } from "@tutkli/jikan-ts";
import { useState } from "react";
import TabOptions from "../TabOptions";

const AnimeCalendar = ({
  animeData,
  dates,
}: {
  animeData: Anime[];
  dates: Map<Number, Number>;
}) => {
  const [display, setDisplay] = useState<0 | 1 | 2 | 3>(3);

  const days = [
    { day: 6, name: "Sunday" },
    { day: 0, name: "Monday" },
    { day: 1, name: "Tuesday" },
    { day: 2, name: "Wednesday" },
    { day: 3, name: "Thursday" },
    { day: 4, name: "Friday" },
    { day: 5, name: "Saturday" },
  ];

  const offset = new Date().getDay();

  return (
    <div className="flex flex-col w-full">
      <TabOptions display={display} setDisplay={setDisplay} scroll />
      <div className="flex flex-col">
        {days.map((_, index) => (
          <AnimeDay
            day={days[(index + offset) % 7].name}
            animeData={animeData.filter(
              (anime) =>
                dates.get(anime.mal_id) == days[(index + offset) % 7].day
            )}
            display={display}
            key={days[(index + offset) % 7].day}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimeCalendar;
