import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { AnimeData } from "@/utils/myAnimeTypes";
import MyAnimePage from "@/components/WatchingFinishedPage";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListVideo, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

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

query ($first: Int, $second: Int, $third: Int, $fourth: Int, $fifth: Int, $sixth: Int) {
  one: Page(page: 1, perPage: 1) {
    media(id: $first) {
      ...media
    }
  }
  two: Page(page: 1, perPage: 1) {
    media(id: $second) {
      ...media
    }
  }
  three: Page(page: 1, perPage: 1) {
    media(id: $third) {
      ...media
    }
  }
  four: Page(page: 1, perPage: 1) {
    media(id: $fourth) {
      ...media
    }
  }
  five: Page(page: 1, perPage: 1) {
    media(id: $fifth) {
      ...media
    }
  }
  six: Page(page: 1, perPage: 1) {
    media(id: $sixth) {
      ...media
    }
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
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Card className="w-full max-w-md bg-[#1f232d] border-0 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Track Your Anime Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="rounded-full p-2 bg-[#d67900] text-white">
                <ListVideo className="h-6 w-6 text-primary-foreground" />
              </div>
              <p className="text-sm">
                Keep track of anime you're watching and have finished
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="rounded-full p-2 bg-[#d67900] text-white">
                <UserPlus className="h-6 w-6 text-primary-foreground" />
              </div>
              <p className="text-sm">
                Get personalized recommendations based on your taste
              </p>
            </div>
            <div className="text-center mt-6">
              <p className="text-slate-400">
                Sign in or create an account to start tracking your anime!
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button asChild className="w-full bg-[#d67900] text-white">
              <Link href="/sign-in">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Link>
            </Button>
            <Button
              asChild
              className="w-full bg-[#1f1f1f] text-[#d67900] hover:text-white"
            >
              <Link href="/sign-up">Create Account</Link>
            </Button>
          </CardFooter>
        </Card>
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
          media.one.media[0],
          media.two.media[0],
          media.three.media[0],
          media.four.media[0],
          media.five.media[0],
          media.six.media[0],
        ]}
      />
    </div>
  );
};

export default page;
