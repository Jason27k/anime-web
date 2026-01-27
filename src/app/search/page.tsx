import { fetchGenres, fetchMyAnimeIds } from "@/app/actions";
import SearchFields from "@/components/SearchFields";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";

const Search = async ({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
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
  const searchPar = await searchParams;
  const selectedGenres = searchPar?.genres;
  const selectedSeason = searchPar?.season;
  const selectedYear = searchPar?.year;
  const query = searchPar?.query;
  const sort = searchPar?.sort;

  const user = await currentUser();
  let loggedIn = false;
  if (user && user.id) {
    loggedIn = true;
  }

  const ids = (await fetchMyAnimeIds()) || [];

  if (selectedSeason && !selectedYear) {
    const currentYear = new Date().getFullYear();
    redirect(
      `/search/?${query ? "query=" + query + "&" : ""}${
        selectedGenres ? "genres=" + selectedGenres + "&" : ""
      }${
        sort ? "sort=" + sort + "&" : ":"
      }season=${selectedSeason}&year=${currentYear}`
    );
  }

  console.log(await searchParams);

  return (
    <Suspense>
      <SearchFields
        genres={genres}
        seasons={seasons}
        years={years.reverse()}
        loggedIn={loggedIn}
        ids={ids}
        searchParams={searchPar}
      />
    </Suspense>
  );
};

export default Search;
