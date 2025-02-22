import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowDownToLine, CirclePlus, Star, User } from "lucide-react";

export default function CalendarLoadingPage() {
  return (
    <div className="flex flex-col w-full">
      <TabOptionsLoading />
      <div className="flex flex-col">
        {[...Array(7)].map((_, index) => (
          <AnimeDayLoading key={index} />
        ))}
      </div>
    </div>
  );
}

function TabOptionsLoading() {
  return (
    <div className="flex justify-between flex-wrap gap-4 sm:gap-0 sm:flex-nowrap items-center pb-2">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24 bg-gray-700" />
        <Skeleton className="h-10 w-24 bg-gray-700" />
        <Skeleton className="h-10 w-24 bg-gray-700" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-md bg-gray-700" />
        <Skeleton className="h-8 w-8 rounded-md bg-gray-700" />
        <Skeleton className="h-8 w-8 rounded-md bg-gray-700" />
      </div>
    </div>
  );
}

function AnimeDayLoading() {
  return (
    <>
      <div className="flex w-full justify-between items-center pt-5 pb-6">
        <Skeleton className="h-10 w-40 bg-gray-700" />
        <Button className="bg-transparent">
          <ArrowDownToLine size={24} className="text-[#d67900]" />
        </Button>
      </div>
      <AnimeDisplayLoading />
    </>
  );
}

function AnimeDisplayLoading() {
  return (
    <ScrollArea className="pt-2 flex justify-center w-full">
      <div className="flex flex-col items-center">
        <div className="hidden min-[465px]:grid w-full grid-cols-1 min-[975px]:grid-cols-2 min-[2000px]:grid-cols-3 gap-4 justify-center">
          {[...Array(3)].map((_, index) => (
            <AnimeCardLoading key={index} />
          ))}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

function AnimeCardLoading() {
  return (
    <div className="flex h-[265px] justify-center w-full">
      <div className="flex flex-col relative h-full w-[185px]">
        <Skeleton className="h-[265px] w-full min-w-[135px] bg-gray-700" />
        <div className="bg-[#000000b3] flex flex-col justify-around items-start absolute bottom-0 w-full min-h-20 p-2">
          <Skeleton className="h-4 w-3/4 bg-gray-500 mb-1" />
          <Skeleton className="h-4 w-1/2 bg-gray-500" />
          <Skeleton className="h-3 w-1/3 bg-[#d67900] mt-2" />
        </div>
      </div>
      <div className="flex flex-col bg-[#1f232d] w-[98%] max-w-[500px]">
        <div className="flex justify-between text-[#9fa7b0] p-3">
          <Skeleton className="h-6 w-1/3 bg-gray-700" />
          <div className="flex flex-col items-end">
            <div className="flex gap-2 items-center">
              <Star size={16} className="text-[#d67900]" />
              <Skeleton className="h-4 w-10 bg-gray-700" />
            </div>
            <div className="flex gap-2 items-center">
              <User size={16} className="text-[#d67900]" />
              <Skeleton className="h-4 w-10 bg-gray-700" />
            </div>
          </div>
        </div>
        <div className="text-[#7c8793] pl-3 w-[98%]">
          <Skeleton className="h-4 w-full bg-gray-700 mb-1" />
          <Skeleton className="h-4 w-full bg-gray-700 mb-1" />
          <Skeleton className="h-4 w-3/4 bg-gray-700" />
        </div>
        <div className="flex flex-row-reverse items-center bg-[#191d26] justify-start mt-auto h-12 px-1 overflow-hidden w-full">
          <div className="ml-auto pl-1">
            <CirclePlus size={24} className="text-[#7c8793] ml-auto" />
          </div>
          <div className="flex items-center justify-start overflow-hidden w-full">
            {[...Array(4)].map((_, index) => (
              <Skeleton
                key={index}
                className="h-6 w-16 bg-[#d67900] rounded-xl mx-1"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
