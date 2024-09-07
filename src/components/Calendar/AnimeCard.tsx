import { CirclePlus, Star, User } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

interface AnimeCardProps {
  image: string;
  title: string;
  producer: string;
  time: String;
  score: number;
  members: number;
  synopsis: String;
  genres: String[];
}

const AnimeCard = ({
  image,
  title,
  producer,
  time,
  score,
  members,
  synopsis,
  genres,
}: AnimeCardProps) => {
  return (
    <div className="flex">
      <div className="flex flex-col relative h-full">
        <div className="relative h-[265px] w-[185px] lg:w-[160px] xl:w-[185px] md:h-[265px]">
          <Image src={image} alt={title} fill />
        </div>
        <div className="bg-[#000000b3] flex flex-col justify-around items-start absolute bottom-0 w-full min-h-20 p-2">
          <p className="text-white line-clamp-3 my-autotext-sm text-start">
            {title}
          </p>
          <p className="text-[#d67900] text-start line-clamp-1 text-xs pt-2">
            {producer}
          </p>
        </div>
      </div>
      <div className="flex flex-col bg-[#1f232d] w-[270px] sm:w-[400px] lg:w-[250px] xl:w-[335px]">
        <div className="flex justify-between text-[#9fa7b0] p-3">
          <p className="text-lg">{time}</p>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <Star size={16} className="text-[#d67900]" />
              <p className="text-sm">{score}</p>
            </div>
            <div className="flex gap-2">
              <User size={16} className="text-[#d67900]" />
              <p className="text-sm">
                {members > 1000000
                  ? Math.floor(members / 100000) / 10 + "M"
                  : Math.floor(members / 1000) + "K"}
              </p>
            </div>
          </div>
        </div>
        <div className="text-[#7c8793] px-3">
          <p className="line-clamp-5 text-sm">{synopsis}</p>
        </div>
        <div className="flex flex-row-reverse items-center bg-[#191d26] justify-start mt-auto h-12 px-1 overflow-hidden">
          <div className="ml-auto pl-1">
            <CirclePlus size={24} className="text-[#7c8793] ml-auto" />
          </div>
          <div className="flex items-center justify-start overflow-scroll">
            {genres.slice(0, 3).map((genre, index) => (
              <Button
                key={index}
                className="rounded-xl bg-[#d67900] hover:bg-[#d67900] h-6 mx-1"
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
