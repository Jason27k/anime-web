import AnimeCard from "@/components/Calendar/AnimeCard";
import { convertToLocalTime } from "@/utils/date";
import { AnimeClient } from "@tutkli/jikan-ts";
import React from "react";

const Test = async () => {
  const animeClient = new AnimeClient();
  const animeResponse = await animeClient.getAnimeById(1);
  const anime = animeResponse.data;
  return (
    <div>
      <AnimeCard
        image={anime.images.webp?.large_image_url ?? anime.images.jpg.image_url}
        title={anime.title_english ?? anime.title}
        time={
          convertToLocalTime(
            anime.broadcast.day,
            anime.broadcast.time,
            anime.broadcast.timezone
          )[0]
        }
        producer={anime.producers[0]?.name ?? ""}
        score={anime.score}
        members={anime.members}
        synopsis={anime.synopsis}
        genres={anime.genres.map((genre) => genre.name)}
      />
    </div>
  );
};

export default Test;
