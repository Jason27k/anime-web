import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, PlayCircle } from "lucide-react";

export default function MyAnimeListLoading() {
  return (
    <div className="h-full w-full">
      <div className="container mx-auto p-4 text-white">
        <h1 className="text-2xl font-bold mb-4">My Anime List</h1>
        <MyAnimePageLoading />
      </div>
      <div className="flex justify-between items-center w-full">
        <Button asChild className="bg-[#d67900] text-white" disabled>
          <Link href="#">Previous</Link>
        </Button>
        <span className="mx-2 text-white">
          <Skeleton className="h-6 w-6 bg-gray-700" />
        </span>
        <Button asChild className="bg-[#d67900] text-white" disabled>
          <Link href="#">Next</Link>
        </Button>
      </div>
    </div>
  );
}

function MyAnimePageLoading() {
  return (
    <div className="">
      <div className="flex justify-center gap-2 pt-4 md:pt-0 py-3">
        <Button className="bg-[#d67900] text-white" disabled>
          All
        </Button>
        <Button className="bg-[#1f1f1f] text-[#d67900]" disabled>
          <PlayCircle className="mr-2 h-4 w-4" />
          <p>Watching</p>
        </Button>
        <Button className="bg-[#1f1f1f] text-[#d67900]" disabled>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          <p>Finished</p>
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, index) => (
          <AnimeCardLoading key={index} />
        ))}
      </div>
    </div>
  );
}

function AnimeCardLoading() {
  return (
    <Card className="overflow-hidden border-0 bg-[#1f232d] flex flex-col justify-between">
      <div className="relative w-full h-48">
        <Skeleton className="h-full w-full" />
      </div>

      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
        <Skeleton className="h-5 w-20 mb-2 bg-blue-600" />
        <Skeleton className="h-4 w-1/2 mb-1 bg-gray-700" />
        <Skeleton className="h-3 w-1/3 bg-gray-700" />
      </CardContent>
      <CardFooter className="p-4 bg-[#191d26]">
        <Skeleton className="h-9 w-full bg-[#d67900]" />
      </CardFooter>
    </Card>
  );
}
