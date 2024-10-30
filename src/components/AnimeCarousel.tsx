import { MediaDisplay } from "@/utils/anilistTypes";
import React from "react";
import Image from "next/image";

interface AnimeCarouselProps {
  animes: MediaDisplay[];
}

const AnimeCarousel = ({ animes }: AnimeCarouselProps) => {
  const anime = animes[1];
  return (
    <div className="w-screen absolute top-0 left-0 h-[350px] flex items-center justify-center bg-gradient-to-br from-black to-slate-500">
      <div className="relative w-full h-[350px]">
        <Image
          src={anime.bannerImage}
          alt={anime.title.romaji}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </div>
  );
};

export default AnimeCarousel;
