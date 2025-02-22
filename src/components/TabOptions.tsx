"use client";

import {
  GalleryHorizontalEnd,
  LayoutGrid,
  LayoutList,
  List,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useContext } from "react";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { cn } from "@/lib/utils";

const TabOptions = ({
  display,
  setDisplay,
  scroll,
  className,
  defaultValue,
  tabTriggers,
  tabContents,
}: {
  display: 0 | 1 | 2 | 3;
  setDisplay: Dispatch<SetStateAction<0 | 1 | 2 | 3>>;
  scroll: boolean;
  className?: string;
  defaultValue?: string;
  tabTriggers?: React.ReactNode;
  tabContents?: React.ReactNode;
}) => {
  const languageContext = useContext(LanguageContext);
  return (
    <>
      <Tabs
        defaultValue={defaultValue || "layout"}
        className={cn(
          className,
          "flex flex-col md:flex-row md:justify-between md:items-center mx-auto w-full sm:mr-0 sm:ml-auto pt-4"
        )}
      >
        <TabsList
          className={cn(
            "grid w-full md:max-w-[400px] bg-transparent text-[#9fa7b0]",
            tabTriggers ? "grid-cols-3" : "grid-cols-2"
          )}
        >
          {tabTriggers}
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="options">Language</TabsTrigger>
        </TabsList>
        <TabsContent value="layout">
          <Card className="bg-transparent text-white border-0">
            <CardContent className="p-0">
              <div className="space-y-1 md:space-y-0">
                <div className="flex justify-center md:justify-end gap-2 pt-4 md:pt-0">
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
                  {scroll && (
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
                  )}
                  <Button
                    className={`${
                      display === 2
                        ? "bg-[#d67900] text-white"
                        : "bg-[#1f1f1f] text-[#d67900]"
                    } px-2 py-1 rounded-md max-[465px]:hidden`}
                    onClick={() => setDisplay(2)}
                  >
                    <LayoutGrid size={24} />
                  </Button>
                  <Button
                    className={`${
                      display === 2 || display === 3
                        ? "bg-[#d67900] text-white"
                        : "bg-[#1f1f1f] text-[#d67900]"
                    } px-2 py-1 rounded-md min-[465px]:hidden`}
                    onClick={() => setDisplay(2)}
                  >
                    <LayoutGrid size={24} />
                  </Button>
                  <Button
                    className={`${
                      display === 3
                        ? "bg-[#d67900] text-white"
                        : "bg-[#1f1f1f] text-[#d67900]"
                    } px-2 py-1 rounded-md max-[465px]:hidden`}
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
            <CardContent className="p-0">
              <div className="space-y-1 md:space-y-0">
                <div className="flex justify-center md:justify-end gap-2 pt-4 md:pt-0">
                  <Button
                    className={`${
                      languageContext.language === LanguageType.Romanji
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
                      languageContext.language === LanguageType.English
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
                      languageContext.language === LanguageType.Japanese
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
        {tabContents}
        <TabsContent value="hide"></TabsContent>
      </Tabs>
    </>
  );
};

export default TabOptions;
