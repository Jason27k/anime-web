import Image from "next/image";
import { Anime } from "@tutkli/jikan-ts";
import { User, Star } from "lucide-react";

interface AnimeCardMediumProps {
  anime: Anime;
  time: String;
}

const AnimeCardMedium = ({ anime, time }: AnimeCardMediumProps) => {
  return (
    <div
      key={anime.mal_id}
      className="flex flex-col items-start h-96 md:h-[22rem] xl:h-96 w-52 md:w-44 xl:w-52"
    >
      <div className="flex flex-col gap-2 justify-start h-96 md:h-[22rem] xl:h-96">
        <div className="relative h-72 w-52 md:w-44 xl:w-52 md:h-64 xl:h-72 flex items-start">
          <Image
            src={
              anime.images.webp?.large_image_url ?? anime.images.jpg.image_url
            }
            alt={anime.title}
            fill={true}
            placeholder="blur"
            blurDataURL="./placeholder.svg"
            loading="lazy"
            className="mx-auto"
          />
        </div>
        <h2 className="text-white line-clamp-2 text-start text-base h-[3rem]">
          {anime.title_english ?? anime.title}
        </h2>
        <div className="flex text-[#8c8c8c] gap-2 text-sm items-end justify-star ">
          <p className="text-start">{time}</p>
          <div className="flex justify-start items-center gap-1">
            <User size={17} />
            <p>
              {" "}
              {anime.members > 1000000
                ? Math.floor(anime.members / 100000) / 10 + "M"
                : Math.floor(anime.members / 1000) + "K"}
            </p>
          </div>
          <div className="flex justify-start items-center gap-1">
            <Star size={17} />
            <p>{anime.score}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeCardMedium;
