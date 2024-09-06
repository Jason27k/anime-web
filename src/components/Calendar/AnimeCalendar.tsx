"use client";
import AnimeDay from "./AnimeDay";
import { Anime } from "@tutkli/jikan-ts";
import {
  GalleryHorizontalEnd,
  LayoutGrid,
  LayoutList,
  List,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const AnimeCalendar = ({
  animeData,
  dates,
}: {
  animeData: Anime[];
  dates: Map<Number, [String, Number]>;
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
    <div className="">
      <div className="flex flex-col">
        <div className="flex sm:hidden justify-end gap-2 pt-4">
          <Button
            className={`${
              display === 0
                ? "bg-[#d67900] text-white"
                : "bg-[#1f1f1f] text-[#d67900]"
            } px-2 py-1 rounded-md`}
            onClick={() => setDisplay(0)}
          >
            <List size={24} className="" />
          </Button>
          <Button
            className={`${
              display === 1
                ? "bg-[#d67900] text-white"
                : "bg-[#1f1f1f] text-[#d67900]"
            } px-2 py-1 rounded-md`}
            onClick={() => setDisplay(1)}
          >
            <GalleryHorizontalEnd size={24} />
          </Button>
          <Button
            className={`${
              display === 2 || display === 3
                ? "bg-[#d67900] text-white"
                : "bg-[#1f1f1f] text-[#d67900]"
            } px-2 py-1 rounded-md`}
            onClick={() => setDisplay(2)}
          >
            <LayoutGrid size={24} />
          </Button>
        </div>
        <div className="hidden sm:flex justify-end gap-2 pt-4">
          <Button
            className={`${
              display === 0
                ? "bg-[#d67900] text-white"
                : "bg-[#1f1f1f] text-[#d67900]"
            } px-2 py-1 rounded-md`}
            onClick={() => setDisplay(0)}
          >
            <List size={24} className="" />
          </Button>
          <Button
            className={`${
              display === 1
                ? "bg-[#d67900] text-white"
                : "bg-[#1f1f1f] text-[#d67900]"
            } px-2 py-1 rounded-md`}
            onClick={() => setDisplay(1)}
          >
            <GalleryHorizontalEnd size={24} />
          </Button>
          <Button
            className={`${
              display === 2
                ? "bg-[#d67900] text-white"
                : "bg-[#1f1f1f] text-[#d67900]"
            } px-2 py-1 rounded-md`}
            onClick={() => setDisplay(2)}
          >
            <LayoutGrid size={24} />
          </Button>
          <Button
            className={`${
              display === 3
                ? "bg-[#d67900] text-white"
                : "bg-[#1f1f1f] text-[#d67900]"
            } px-2 py-1 rounded-md`}
            onClick={() => setDisplay(3)}
          >
            <LayoutList size={24} />
          </Button>
        </div>
        {days.map((_, index) => (
          <AnimeDay
            day={days[(index + offset) % 7].name}
            animeData={animeData.filter((anime) =>
              dates.get(anime.mal_id)?.includes(days[(index + offset) % 7].day)
            )}
            dates={dates}
            display={display}
            key={days[(index + offset) % 7].day}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimeCalendar;
