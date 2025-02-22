"use client";
import { useState } from "react";
import { AiringSchedule } from "@/utils/anilistTypes";
import { Button } from "../ui/button";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import AnimeDisplay from "../AnimeDisplay";

interface AnimeDayProps {
  day: String;
  airingSchedules: AiringSchedule[];
  display: 0 | 1 | 2 | 3;
  loggedIn: boolean;
  ids: number[];
}

const AnimeDay = ({
  day,
  airingSchedules,
  display,
  loggedIn,
  ids,
}: AnimeDayProps) => {
  const [collapse, setCollapse] = useState(false);

  const handleCollapse = () => {
    setCollapse(!collapse);
  };

  return (
    <>
      <div className="flex w-full justify-between items-center pt-5 pb-6">
        <h1 className="text-white text-4xl">{day}</h1>
        <Button className="bg-transparent" onClick={handleCollapse}>
          {collapse ? (
            <ArrowDownToLine size={24} className="text-[#d67900]" />
          ) : (
            <ArrowUpToLine size={24} className="text-[#d67900]" />
          )}
        </Button>
      </div>
      {!collapse && (
        <AnimeDisplay
          display={display}
          airingSchedules={airingSchedules}
          scroll
          loggedIn={loggedIn}
          ids={ids}
        />
      )}
    </>
  );
};

export default AnimeDay;
