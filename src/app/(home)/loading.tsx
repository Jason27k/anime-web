import React from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, User } from "lucide-react";

const LoadingPage = () => {
  return (
    <div>
      <AnimeHomeRowsLoading />
    </div>
  );
};

const AnimeHomeRowsLoading = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-8 pt-2 h-full">
        <AnimeRowLoading title="Trending" link="/search?sort=TRENDING_DESC" />
        <AnimeRowLoading title="Top All Time" link="/search?sort=SCORE_DESC" />
        <AnimeRowLoading title="Upcoming Season" link="/upcoming" />
        <AnimeRowLoading
          title="Popular Anime"
          link="/search?sort=POPULARITY_DESC"
        />
        <AnimeRowLoading title="Romance Lover" link="/search?genres=Romance" />
      </div>
    </div>
  );
};

const AnimeRowLoading = ({ title, link }: { title: string; link: string }) => {
  return (
    <>
      <div className="flex flex-col text-white gap-2">
        <div className="flex justify-between">
          <h1 className="text-2xl">{title}</h1>
          <Link href={link}>View All</Link>
        </div>
        <div className="grid grid-cols-2 min-[500px]:grid-cols-3 md:grid-cols-5 xl:grid-cols-6 gap-10 justify-center">
          {[...Array(5)].map((_, index) => (
            <AnimeMediumResizableLoading key={index} />
          ))}
          <div className="block md:hidden xl:block">
            <AnimeMediumResizableLoading />
          </div>
        </div>
      </div>
    </>
  );
};

const AnimeMediumResizableLoading = () => {
  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-col gap-2 justify-start w-full">
        <div className="relative w-full h-52">
          <Skeleton className="w-full h-full" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="flex flex-wrap min-[450px]:flex-nowrap text-[#8c8c8c] gap-2 text-sm items-end justify-between -mt-1">
          <div className="flex justify-start items-center gap-1">
            <User size={17} />
            <Skeleton className="w-12 h-4" />
          </div>
          <Skeleton className="w-20 h-4" />
          <div className="flex justify-start items-center gap-1">
            <Star size={17} />
            <Skeleton className="w-8 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
