"use client";
import { useState } from "react";
import { Anime } from "@tutkli/jikan-ts";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AnimeLarge from "./AnimeLarge";
import AnimeSmall from "./AnimeSmall";
import { Button } from "../ui/button";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import AnimeMedium from "./AnimeMedium";

interface AnimeDayProps {
  day: String;
  animeData: Anime[];
  dates: Map<Number, [String, Number]>;
  display: 0 | 1 | 2 | 3;
}

const AnimeMediumFormatted = ({
  animeData,
  dates,
  scroll,
}: {
  animeData: Anime[];
  dates: Map<Number, [String, Number]>;
  scroll?: boolean;
}) => {
  if (scroll) {
    return (
      <div className="flex gap-4 justify-center">
        <AnimeMedium animeData={animeData} dates={dates} scroll={scroll} />
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2 justify-center sm:justify-start w-full">
      <AnimeMedium animeData={animeData} dates={dates} />
    </div>
  );
};

const AnimeDay = ({ day, animeData, dates, display }: AnimeDayProps) => {
  const [collapse, setCollapse] = useState(false);

  const handleCollapse = () => {
    setCollapse(!collapse);
  };

  return (
    <>
      <div className="flex w-full justify-between items-center pt-10 pb-6">
        <h1 className="text-white text-4xl">{day}</h1>
        <Button className="bg-transparent" onClick={handleCollapse}>
          {collapse ? (
            <ArrowDownToLine size={24} className="text-[#d67900]" />
          ) : (
            <ArrowUpToLine size={24} className="text-[#d67900]" />
          )}
        </Button>
      </div>

      <ScrollArea>
        <div className="flex flex-col items-start">
          <div className={`${collapse ? "hidden" : "flex"} w-full`}>
            {display == 0 ? (
              <div className="flex flex-wrap gap-5 justify-start">
                <AnimeSmall animeData={animeData} dates={dates} />
              </div>
            ) : display == 1 ? (
              <AnimeMediumFormatted
                animeData={animeData}
                dates={dates}
                scroll
              />
            ) : display == 2 ? (
              <AnimeMediumFormatted animeData={animeData} dates={dates} />
            ) : (
              <div className="">
                <div className="sm:hidden">
                  <AnimeMediumFormatted animeData={animeData} dates={dates} />
                </div>
                <div className="hidden sm:flex justify-center flex-wrap gap-x-4 gap-y-3 lg:gap-5">
                  <AnimeLarge animeData={animeData} dates={dates} />
                </div>
              </div>
            )}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};

export default AnimeDay;
