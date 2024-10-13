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
    { day: 1, name: "Monday" },
    { day: 2, name: "Tuesday" },
    { day: 3, name: "Wednesday" },
    { day: 4, name: "Thursday" },
    { day: 5, name: "Friday" },
    { day: 6, name: "Saturday" },
    { day: 7, name: "Sunday" },
  ];

  const offset = new Date().getDay() - 1;

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
