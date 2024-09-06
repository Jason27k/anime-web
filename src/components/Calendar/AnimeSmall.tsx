import Image from "next/image";
import { Star, User } from "lucide-react";
import { Anime } from "@tutkli/jikan-ts";

const AnimeSmall = ({
  animeData,
  dates,
}: {
  animeData: Anime[];
  dates: Map<Number, [String, Number]>;
}) => {
  return <div>AnimeSmall</div>;
};

export default AnimeSmall;
