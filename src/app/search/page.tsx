import { fetchAnimeSearch, fetchGenres } from "@/app/actions";
import SearchFields from "@/components/SearchFields";
import { redirect } from "next/navigation";

const Search = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) => {
  const genres = await fetchGenres();
  const currentYear = new Date().getFullYear();
  const range = (start: number, stop: number, step: number) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    );
  const years = range(1940, currentYear, 1);
  const seasons = ["winter", "spring", "summer", "fall"];
  const formats = ["TV", "OVA", "Movie", "Special"];

  const selectedGenres = searchParams?.genres;
  const selectedSeason = searchParams?.season;
  const selectedYear = searchParams?.year;
  const selectedFormat = searchParams?.format;
  const query = searchParams?.query;

  if (selectedSeason && !selectedYear) {
    const currentYear = new Date().getFullYear();
    redirect(
      `/search/?${query ? "query=" + query + "&" : ""}${
        selectedGenres ? "genres=" + selectedGenres + "&" : ""
      }${
        selectedFormat ? "format=" + selectedFormat + "&" : ""
      }season=${selectedSeason}&year=${currentYear}`
    );
  }

  const response = await fetchAnimeSearch(
    selectedGenres,
    selectedYear,
    selectedFormat,
    query,
    selectedSeason
  );
  const animeData = response?.data;

  return (
    <div>
      {genres && animeData && (
        <SearchFields
          genres={genres}
          seasons={seasons}
          years={years.reverse()}
          formats={formats}
          animeData={
            selectedSeason
              ? animeData.filter((anime) => anime.season === selectedSeason)
              : animeData
          }
        />
      )}
    </div>
  );
};

export default Search;
