"use client";
import AnimeDay from "./AnimeDay";
import { AiringSchedule } from "@/utils/anilistTypes";
import { useState } from "react";
import TabOptions from "../TabOptions";
import { convertUTCToLocal } from "@/utils/date";

const AnimeCalendar = ({
  airingSchedules,
  loggedIn,
  ids,
}: {
  airingSchedules: AiringSchedule[];
  loggedIn: boolean;
  ids: number[];
}) => {
  const [display, setDisplay] = useState<0 | 1 | 2 | 3>(3);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const offset = new Date().getDay();

  return (
    <div className="flex flex-col w-full">
      <TabOptions display={display} setDisplay={setDisplay} scroll />
      <div className="flex flex-col w-full">
        {days.map((_, index) => (
          <AnimeDay
            key={index}
            day={days[(index + offset) % 7]}
            display={display}
            loggedIn={loggedIn}
            ids={ids}
            airingSchedules={airingSchedules.filter(
              (schedule) =>
                convertUTCToLocal(schedule.airingAt).getDay() ===
                (index + offset) % 7
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimeCalendar;
