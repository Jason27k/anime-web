import { fetchAniListAnime, getMyListEntry } from "@/app/actions";
import AnimeDetailsTwo from "@/components/AnimeDetailsTwo";
import { currentUser } from "@clerk/nextjs/server";

const DetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = parseInt((await params).id);
  if (isNaN(id)) {
    return <div>Invalid ID</div>;
  }

  const animeResponse = await fetchAniListAnime(id);
  const anime = animeResponse.data.Media;

  const user = await currentUser();
  const loggedIn = !!user;
  const listEntry = loggedIn ? await getMyListEntry(id) : null;

  return (
    <AnimeDetailsTwo
      anime={anime}
      loggedIn={loggedIn}
      liked={listEntry !== null}
      listEntry={listEntry ? { status: listEntry.status, episode: listEntry.episode } : null}
    />
  );
};

export default DetailsPage;
