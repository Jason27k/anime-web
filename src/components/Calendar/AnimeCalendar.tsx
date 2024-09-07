"use client";
import AnimeDay from "./AnimeDay";
import { Anime } from "@tutkli/jikan-ts";
import {
  EyeOff,
  GalleryHorizontalEnd,
  LayoutGrid,
  LayoutList,
  List,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useContext } from "react";
import { LanguageContext, LanguageType } from "@/app/Provider";

const AnimeCalendar = ({
  animeData,
  dates,
}: {
  animeData: Anime[];
  dates: Map<Number, [String, Number]>;
}) => {
  const [display, setDisplay] = useState<0 | 1 | 2 | 3>(3);
  const languageContext = useContext(LanguageContext);

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
    <div className="flex flex-col">
      <Tabs
        defaultValue="layout"
        className="mx-auto sm:w-[400px] sm:mr-0 sm:ml-auto pt-3"
      >
        <TabsList className="grid w-full grid-cols-3 bg-transparent text-[#9fa7b0]">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
          <TabsTrigger value="hide">
            <EyeOff size={18} />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="layout">
          <Card className="bg-transparent text-white border-0">
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <div className="flex sm:hidden justify-center sm:justify-end gap-2 pt-4">
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
                <div className="hidden sm:flex justify-center sm:justify-end gap-2 pt-4">
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="options">
          <Card className="bg-transparent text-white border-0">
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-center sm:justify-end gap-2 pt-4">
                  <Button
                    className={`${
                      display === 0
                        ? "bg-[#d67900] text-white"
                        : "bg-[#1f1f1f] text-[#d67900]"
                    } px-2 py-1 rounded-md`}
                    onClick={() =>
                      languageContext.setLanguage(LanguageType.Romanji)
                    }
                  >
                    Romanji
                  </Button>
                  <Button
                    className={`${
                      display === 0
                        ? "bg-[#d67900] text-white"
                        : "bg-[#1f1f1f] text-[#d67900]"
                    } px-2 py-1 rounded-md`}
                    onClick={() =>
                      languageContext.setLanguage(LanguageType.English)
                    }
                  >
                    English
                  </Button>
                  <Button
                    className={`${
                      display === 0
                        ? "bg-[#d67900] text-white"
                        : "bg-[#1f1f1f] text-[#d67900]"
                    } px-2 py-1 rounded-md`}
                    onClick={() =>
                      languageContext.setLanguage(LanguageType.Japanese)
                    }
                  >
                    Japanese
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="hide"></TabsContent>
      </Tabs>

      <div className="flex flex-col">
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
