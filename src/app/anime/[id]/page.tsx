import { fetchAniListAnime, getMyListEntry } from "@/app/actions";
import AnimeDetails from "@/components/AnimeDetails";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import AnimeDetailLoading from "./loading";

async function AnimeDetailsContent({ id }: { id: number }) {
  const [animeResponse, user] = await Promise.all([
    fetchAniListAnime(id),
    currentUser(),
  ]);

  const anime = animeResponse.data.Media;
  const loggedIn = !!user;
  const listEntry = loggedIn ? await getMyListEntry(id) : null;

  return (
    <AnimeDetails
      anime={anime}
      loggedIn={loggedIn}
      liked={listEntry !== null}
      listEntry={listEntry ? { status: listEntry.status, episode: listEntry.episode } : null}
    />
  );
}

const DetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = parseInt((await params).id);
  if (isNaN(id)) {
    return <div>Invalid ID</div>;
  }

  return (
    <Suspense fallback={<AnimeDetailLoading />}>
      <AnimeDetailsContent id={id} />
    </Suspense>
  );
};

export default DetailsPage;
