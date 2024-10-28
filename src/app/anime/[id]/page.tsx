import { fetchAniListAnime } from "@/app/actions";
import AnimeDetailsTwo from "@/components/AnimeDetailsTwo";
import { MediaResponse } from "@/utils/anilistTypes";

const DetailsPage = async ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return <div>Invalid ID</div>;
  }

  const aniListDetailsQuery = await fetchAniListAnime(id);

  const animeResponse: MediaResponse = await aniListDetailsQuery.json();
  const anime = animeResponse.data.Media;
  return (
    <>
      <AnimeDetailsTwo anime={anime} />
    </>
  );
};

export default DetailsPage;
