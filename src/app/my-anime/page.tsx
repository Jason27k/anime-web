import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Anime } from "@/utils/myAnimeTypes";
import AnimeList from "@/components/AnimeList";
import ProfileLayout from "@/components/ProfileLayout";
import { Button } from "@/components/ui/button";
import {
  fetchSavedAnime,
  fetchAnimeStats,
  getLikedAnimesList,
} from "../actions";
import NoUserFound from "@/components/NoUserFound";
import NoLikedAnime from "@/components/NoLikedAnime";
import { AnimeStatus } from "@/lib/api-client";

const PER_PAGE = 20;

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const user = await currentUser();

  if (!user) {
    return <NoUserFound />;
  }

  const page = (await searchParams)?.page;
  if (page && isNaN(parseInt(page))) {
    return <div className="">Page not found</div>;
  }

  const pageNumber = page ? parseInt(page) : 0;

  const [savedAnimeResponse, stats] = await Promise.all([
    fetchSavedAnime(undefined, pageNumber, PER_PAGE),
    fetchAnimeStats(),
  ]);

  const totalCount = stats?.total || 0;
  const pageCount = Math.ceil(totalCount / PER_PAGE);

  if (pageNumber > pageCount || pageNumber < 0) {
    return <div className="">Page not found</div>;
  }

  // Show empty state within the profile layout
  if (!savedAnimeResponse || savedAnimeResponse.content.length === 0) {
    if (pageNumber === 0) {
      return (
        <ProfileLayout stats={stats || undefined}>
          <NoLikedAnime />
        </ProfileLayout>
      );
    }
    return <div className="">Page not found</div>;
  }

  const likedAnimes: AnimeInfo[] = await getLikedAnimesList(
    savedAnimeResponse.content,
    PER_PAGE
  );

  return (
    <ProfileLayout stats={stats || undefined}>
      <div className="space-y-4">
        <AnimeList animeInfoList={likedAnimes} route="all" />

        {pageCount > 1 && (
          <div className="flex justify-center items-center gap-4 pt-4">
            {pageNumber > 0 ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/my-anime?page=${pageNumber - 1}`}>Previous</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
            )}

            <span className="text-white text-sm">
              Page {pageNumber + 1} of {pageCount}
            </span>

            {pageCount > pageNumber + 1 ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/my-anime?page=${pageNumber + 1}`}>Next</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            )}
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}

export type AnimeInfo = {
  id: number;
  status: AnimeStatus;
  episode: number | null;
  anime: Anime;
};
