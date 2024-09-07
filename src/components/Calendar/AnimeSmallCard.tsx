import { Anime } from "@tutkli/jikan-ts";
import Image from "next/image";

interface AnimeSmallCardProps {
  image: string;
  title: string;
  time: String;
}

const AnimeSmallCard = ({ title, image, time }: AnimeSmallCardProps) => {
  return (
    <div className="flex w-[45%] sm:w-60">
      <div className="relative h-[4.2rem] w-14">
        <Image src={image} alt={title} fill={true} />
      </div>
      <div className="flex flex-col justify-start bg-[#1f232d] w-full sm:w-40 px-2 pt-2">
        <h1 className="text-white text-sm line-clamp-2">{title}</h1>
        <p className="text-[#8c8c8c] text-xs">{time}</p>
      </div>
    </div>
  );
};

export default AnimeSmallCard;
