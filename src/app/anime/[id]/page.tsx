import { fetchAniListAnime, fetchAnime } from "@/app/actions";
import AnimeDetails from "@/components/AnimeDetails";
import { MediaResponse } from "@/utils/anilistTypes";

const DetailsPage = async ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return <div>Invalid ID</div>;
  }

  const jikanResponse = await fetchAnime(id);
  if (!jikanResponse) {
    return <div>Not Found</div>;
  }
  const anime = jikanResponse.data;

  const aniListDetailsQuery = await fetchAniListAnime(id);

  const animeResponse: MediaResponse = await aniListDetailsQuery.json();
  const aniAnime = animeResponse.data.Media;

  return (
    <>
      <AnimeDetails anime={anime} aniAnime={aniAnime} />
    </>
  );
};

export default DetailsPage;
