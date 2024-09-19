import Image from "next/image";
import { Anime } from "@tutkli/jikan-ts";
import { User, Star } from "lucide-react";

interface AnimeCardMediumProps {
  time: String;
  image: string;
  title: string;
  members: number;
  score: number;
  scroll?: boolean;
}

const AnimeCardMedium = ({
  title,
  image,
  time,
  members,
  score,
  scroll,
}: AnimeCardMediumProps) => {
  return (
    <div
      className={`flex flex-col items-start h-96 ${
        scroll ? "" : "md:h-[22rem] xl:h-96 w-52 md:w-44 xl:w-52"
      }`}
    >
      <div
        className={`flex flex-col gap-2 justify-start h-96 ${
          scroll ? "" : "md:h-[22rem] xl:h-96"
        }`}
      >
        <div
          className={`relative h-72 w-52 ${
            scroll ? " " : "md:w-44 xl:w-52 md:h-64 xl:h-72"
          } flex items-start`}
        >
          <Image
            src={image}
            alt={title}
            fill={true}
            placeholder="blur"
            blurDataURL="./placeholder.svg"
            loading="lazy"
            className="mx-auto"
          />
        </div>
        <h2
          className={`${
            scroll ? "w-52" : " "
          } text-white line-clamp-2 text-start  text-base h-[3rem]`}
        >
          {title}
        </h2>
        <div className="flex text-[#8c8c8c] gap-2 text-sm items-end justify-star ">
          <p className="text-start">{time}</p>
          <div className="flex justify-start items-center gap-1">
            <User size={17} />
            <p>
              {" "}
              {members > 1000000
                ? Math.floor(members / 100000) / 10 + "M"
                : Math.floor(members / 1000) + "K"}
            </p>
          </div>
          <div className="flex justify-start items-center gap-1">
            <Star size={17} />
            <p>{score}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeCardMedium;
