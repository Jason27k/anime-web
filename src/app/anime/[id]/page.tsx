import { fetchAniListAnime } from "@/app/actions";
import AnimeDetailsTwo from "@/components/AnimeDetailsTwo";
import { db } from "@/db";
import { MyAnimesTable } from "@/db/schema";
import { MediaResponse } from "@/utils/anilistTypes";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

const DetailsPage = async ({ params }: { params: { id: string } }) => {
  const id = parseInt((await params).id);
  if (isNaN(id)) {
    return <div>Invalid ID</div>;
  }

  const aniListDetailsQuery = await fetchAniListAnime(id);

  const animeResponse: MediaResponse = await aniListDetailsQuery.json();
  const anime = animeResponse.data.Media;

  const user = await currentUser();
  let liked = false;
  let loggedIn = false;
  if (user) {
    loggedIn = true;
    liked =
      (await db.$count(
        MyAnimesTable,
        and(eq(MyAnimesTable.user_id, user.id), eq(MyAnimesTable.anime_id, id))
      )) > 0;
  }

  return (
    <>
      <AnimeDetailsTwo anime={anime} loggedIn={loggedIn} liked={liked} />
    </>
  );
};

export default DetailsPage;
