"use client";
import { useState } from "react";
import { Anime } from "@tutkli/jikan-ts";
import { Button } from "../ui/button";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import AnimeDisplay from "../AnimeDisplay";

interface AnimeDayProps {
  day: String;
  animeData: Anime[];
  display: 0 | 1 | 2 | 3;
}

const AnimeDay = ({ day, animeData, display }: AnimeDayProps) => {
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
        <AnimeDisplay animeData={animeData} display={display} scroll />
      )}
    </>
  );
};

export default AnimeDay;
