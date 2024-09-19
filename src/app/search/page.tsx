import { fetchGenres } from "../actions";
import SearchFields from "@/components/SearchFields";

const Search = async () => {
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

  return (
    <div>
      <h1>Search</h1>
      {genres && (
        <SearchFields
          genres={genres}
          seasons={seasons}
          years={years}
          formats={formats}
        />
      )}
    </div>
  );
};

export default Search;
