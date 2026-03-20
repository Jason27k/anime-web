import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { AnimeInfo } from "../page";
import AnimeList from "@/components/AnimeList";
import ProfileLayout from "@/components/ProfileLayout";
import { Button } from "@/components/ui/button";
import { fetchMyList, fetchMyListStats } from "@/app/actions";
import NoUserFound from "@/components/NoUserFound";
import { Anime } from "@/utils/myAnimeTypes";

const PER_PAGE = 20;

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const user = await currentUser();
  if (!user) return <NoUserFound />;

  const page = (await searchParams)?.page;
  if (page && isNaN(parseInt(page))) return <div>Page not found</div>;
  const pageNumber = page ? parseInt(page) : 0;

  const [myList, stats] = await Promise.all([
    fetchMyList("COMPLETED"),
    fetchMyListStats(),
  ]);

  const pageCount = Math.ceil(myList.length / PER_PAGE);

  if (pageNumber < 0 || (pageCount > 0 && pageNumber >= pageCount)) {
    return <div>Page not found</div>;
  }

  const paged = myList.slice(pageNumber * PER_PAGE, (pageNumber + 1) * PER_PAGE);

  const animeInfoList: AnimeInfo[] = paged.map((e) => ({
    id: e.animeId,
    status: e.status,
    episode: e.episode,
    anime: e.anime as Anime,
  }));

  return (
    <ProfileLayout stats={stats ?? undefined}>
      <div className="space-y-4">
        <AnimeList animeInfoList={animeInfoList} route="finished" />

        {pageCount > 1 && (
          <div className="flex justify-center items-center gap-4 pt-4">
            {pageNumber > 0 ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/my-anime/finished?page=${pageNumber - 1}`}>Previous</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>Previous</Button>
            )}

            <span className="text-foreground text-sm">
              Page {pageNumber + 1} of {pageCount}
            </span>

            {pageNumber + 1 < pageCount ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/my-anime/finished?page=${pageNumber + 1}`}>Next</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>Next</Button>
            )}
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}
