import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { AnimeInfo } from "../page";
import MyAnimePage from "@/components/WatchingFinishedPage";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { MyAnimesTable } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { getLikedAnimesList } from "@/app/actions";
import NoUserFound from "@/components/NoUserFound";
import NoLikedAnime from "@/components/NoLikedAnime";

const PER_PAGE = 20;

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
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

  const likedAnimeCount = await db.$count(
    MyAnimesTable,
    eq(MyAnimesTable.user_id, user.id)
  );
  const pageCount = Math.ceil(likedAnimeCount / PER_PAGE);

  if (pageNumber > pageCount || pageNumber < 0) {
    return <div className="">Page not found</div>;
  }

  let likedAnimesList = await db
    .select()
    .from(MyAnimesTable)
    .where(
      and(eq(MyAnimesTable.user_id, user.id), eq(MyAnimesTable.finished, false))
    )
    .orderBy(desc(MyAnimesTable.created_at))
    .limit(PER_PAGE)
    .offset(PER_PAGE * pageNumber);

  const likedAnimes: AnimeInfo[] = await getLikedAnimesList(
    likedAnimesList,
    PER_PAGE
  );

  return (
    <div className="h-full w-full">
      <div className="container mx-auto p-4 text-white ">
        <h1 className="text-2xl font-bold mb-4">My Anime List</h1>
        <MyAnimePage animeInfoList={likedAnimes} route={"watching"} />
      </div>
      <div className="flex justify-between items-center w-full">
        <Button
          asChild
          className="bg-[#d67900] text-white"
          disabled={pageNumber === 0}
        >
          <Link href={`/my-anime?page=${pageNumber - 1}`}>Previous</Link>
        </Button>
        <span className="mx-2 text-white">{pageNumber + 1}</span>
        <Button
          asChild
          className="bg-[#d67900] text-white"
          disabled={pageNumber === pageCount - 1}
        >
          <Link href={`/my-anime?page=${pageNumber + 1}`}>Next</Link>
        </Button>
      </div>
    </div>
  );
}
