import { animeSearch, fetchGenres } from "@/app/actions";
import SearchFields from "@/components/SearchFields";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SearchQueryResponse } from "@/utils/anilistTypes";

const Search = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) => {
  const genres: String[] = await fetchGenres();
  const currentYear = new Date().getFullYear();
  const range = (start: number, stop: number, step: number) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    );
  const years = range(1940, currentYear, 1);
  const seasons = ["WINTER", "SPRING", "SUMMER", "FALL"];

  const selectedGenres = searchParams?.genres;
  const selectedSeason = searchParams?.season;
  const selectedYear = searchParams?.year;
  const query = searchParams?.query;

  if (selectedSeason && !selectedYear) {
    const currentYear = new Date().getFullYear();
    redirect(
      `/search/?${query ? "query=" + query + "&" : ""}${
        selectedGenres ? "genres=" + selectedGenres + "&" : ""
      }season=${selectedSeason}&year=${currentYear}`
    );
  }

  const variables = {
    genres: selectedGenres?.split(","),
    year: selectedSeason ? undefined : selectedYear,
    search: query,
    season: selectedSeason?.toUpperCase() as
      | "WINTER"
      | "SPRING"
      | "SUMMER"
      | "FALL",
    seasonYear: selectedSeason
      ? selectedYear
        ? Number(selectedYear)
        : currentYear
      : undefined,
    page: 1,
  };

  const response: SearchQueryResponse = await animeSearch(variables);
  const animeData = response.data.Page.media;
  if (!animeData) {
    return <div>Error loading data</div>;
  }

  return (
    <Suspense>
      <SearchFields
        genres={genres}
        seasons={seasons}
        years={years.reverse()}
        animeData={animeData}
        hasNextPage={response.data.Page.pageInfo.hasNextPage}
      />
    </Suspense>
  );
};

export default Search;
