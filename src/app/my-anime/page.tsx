import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { AnimeData } from "@/utils/myAnimeTypes";
import MyAnimePage from "@/components/WatchingFinishedPage";

const query = `
fragment media on Media {
  id
  title {
    userPreferred
    romaji
    english
    native
  }
  coverImage {
    extraLarge
  }
  episodes
  streamingEpisodes {
    title
  }
  nextAiringEpisode {
    id
    airingAt
    episode
  }
  season
  seasonYear
}


query($first:Int, $second:Int, $third:Int, $fourth:Int, $fifth:Int, $sixth:Int) {
  one: Media(id:$first) {
    ...media
  }
  two: Media(id:$second) {
    ...media
  }
  three: Media(id:$third) {
    ...media
  }
  four: Media(id:$fourth) {
    ...media
  } 
  five: Media(id:$fifth) {
    ...media
  } 
  six: Media(id:$sixth) {
    ...media
  }
}
`;

const variables = {
  first: 163134,
  second: 9253,
  third: 21234,
  fourth: 120120,
  fifth: 21049,
  sixth: 21647,
};

const page = async () => {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="">
        <Link href="/sign-in">Sign In</Link>
      </div>
    );
  }

  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const data: AnimeData = await response.json();
  const media = data.data;

  return (
    <div className="">
      <MyAnimePage
        animes={[
          media.one,
          media.two,
          media.three,
          media.four,
          media.five,
          media.six,
        ]}
      />
    </div>
  );
};

export default page;
