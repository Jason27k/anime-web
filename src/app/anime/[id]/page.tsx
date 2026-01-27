import { fetchAniListAnime, hasUserSavedAnime } from "@/app/actions";
import AnimeDetailsTwo from "@/components/AnimeDetailsTwo";
import { MediaResponse } from "@/utils/anilistTypes";
import { currentUser } from "@clerk/nextjs/server";

const DetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
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
    liked = await hasUserSavedAnime(id);
  }

  return (
    <>
      <AnimeDetailsTwo anime={anime} loggedIn={loggedIn} liked={liked} />
    </>
  );
};

export default DetailsPage;
