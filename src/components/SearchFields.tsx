"use client";

import { Anime, Genre } from "@tutkli/jikan-ts";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { SearchIcon, X } from "lucide-react";
import { GenreComboBox } from "./GenreComboBox";
import { useEffect, useState, useCallback } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import TabOptions from "@/components/TabOptions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import AnimeDisplay from "./AnimeDisplay";
import { useInView } from "react-intersection-observer";
import { fetchAnimeSearch } from "@/app/actions";

interface SearchFieldsProps {
  genres: Genre[];
  seasons: string[];
  years: number[];
  className?: string;
  animeData: Anime[];
}

const SearchFields = ({
  genres,
  seasons,
  years,
  className,
  animeData,
}: SearchFieldsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [page, setPage] = useState(2);

  useEffect(() => {
    setAnimes(animeData);
    setPage(2);
  }, [animeData]);

  const selectedYear = searchParams.get("year");
  const selectedSeason = searchParams.get("season");
  const selectedGenres = searchParams.get("genres")?.split(",");

  const { ref, inView } = useInView();

  useEffect(() => {
    async function fetchMore() {
      const response = await fetchAnimeSearch(
        selectedGenres?.join(",") ?? undefined,
        selectedYear ?? undefined,
        searchParams.get("query") ?? undefined,
        selectedSeason ?? undefined,
        page
      );
      if (response?.data && response.data.length > 0) {
        setAnimes([
          ...animes,
          ...response.data.filter((anime) => anime.members > 1000),
        ]);
        setPage(page + 1);
      } else {
        setPage(-1);
      }
    }
    if (inView) {
      fetchMore();
      console.log(page);
    }
  }, [
    inView,
    selectedGenres,
    selectedYear,
    searchParams,
    selectedSeason,
    page,
    animes,
  ]);

  const [yearsPopOpen, setYearsPopOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [display, setDisplay] = useState<0 | 1 | 2 | 3>(3);
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "") {
        params.delete(name);
        return params.toString();
      }
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const createQueryStringPair = useCallback(
    (nameOne: string, valueOne: string, nameTwo: string, valueTwo: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (valueOne === "" || valueTwo === "") {
        params.delete(nameOne);
        params.delete(nameTwo);
        return params.toString();
      }
      params.set(nameOne, valueOne);
      params.set(nameTwo, valueTwo);
      return params.toString();
    },
    [searchParams]
  );

  const returnParamsExcepts = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      router.push(pathname + "?" + createQueryString("query", debouncedQuery));
      router.refresh();
    } else {
      if (searchParams.has("query")) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("query");
        router.push(pathname + "?" + params.toString());
      }
    }
  }, [debouncedQuery, createQueryString, pathname, router, searchParams]);

  const handleYearSelect = (year: string) => {
    setYearsPopOpen(false);
    router.push(pathname + "?" + createQueryString("year", year).toString());
  };

  const handleSeasonSelect = (season: string) => {
    if (searchParams.has("year")) {
      router.push(
        pathname + "?" + createQueryString("season", season).toString()
      );
    } else {
      const currentYear = new Date().getFullYear();
      router.push(
        pathname +
          "?" +
          createQueryStringPair("season", season, "year", String(currentYear))
      );
    }
  };

  const handleGenreRemove = (genreID: String) => {
    const newSelectedGenres = (selectedGenres || [])
      .filter((value) => value !== genreID)
      .join(",");
    const newParams = returnParamsExcepts("genres");

    if (newSelectedGenres.length === 0) {
      router.push(`${pathname}?${newParams}`);
    } else {
      const updatedUrl = `${pathname}?${newParams}${
        newParams.length > 0 ? "&" : ""
      }genres=${newSelectedGenres}`;
      router.push(updatedUrl);
    }
  };

  return (
    <div className={cn(className, `"w-full mt-2"`)}>
      <div className="flex flex-wrap min-[990px]:h-[64px] text-white lg:justify-between lg:flex-nowrap gap-2 px-0 ">
        <div className="flex flex-col gap-1 w-full lg:max-w-none mb-0">
          <Label htmlFor="search">Title</Label>
          <div className="rounded-md border border-input bg-background flex items-center w-full">
            <SearchIcon className="text-muted-foreground pl-2" size={20} />
            <Input
              placeholder="Search"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="inline border-0 pl-1 focus-visible:ring-0 focus-visible:ring-transparent text-black focus-visible:ring-offset-0"
            />
          </div>
        </div>
        <div className="flex w-full justify-between flex-wrap md:flex-nowrap gap-2">
          <div className="flex flex-col gap-1 w-full mb-0">
            <Label htmlFor="genres">Genres</Label>
            <div className="rounded-md border border-input bg-background flex items-center w-full">
              <GenreComboBox genres={genres} />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full mb-0">
            <Label htmlFor="years">Year</Label>
            <div className="rounded-md border border-input bg-background flex items-center w-full">
              <Popover open={yearsPopOpen} onOpenChange={setYearsPopOpen}>
                <PopoverTrigger asChild className="w-full">
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between border-input h-[42px] text-muted-foreground font-normal group"
                    id="years"
                  >
                    {selectedYear ? selectedYear : "Select year..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 hidden group-hover:block" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-screen md:w-full bg-transparent border-0 px-5 -mt-4 md:px-0 md:mt-0">
                  <Command value={selectedYear || undefined} className="w-full">
                    <CommandInput
                      placeholder="Search years..."
                      className="text-muted-foreground w-full"
                    />
                    <CommandList className="w-full">
                      <CommandEmpty>No Year found.</CommandEmpty>
                      <CommandGroup className="w-full">
                        {years.map((currentYear) => (
                          <CommandItem
                            key={currentYear}
                            value={String(currentYear)}
                            onSelect={handleYearSelect}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedYear === String(currentYear)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {currentYear}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full mb-0">
            <Label htmlFor="seasons">Seasons</Label>
            <div className="rounded-md border border-input bg-background flex items-center w-full">
              <Select
                onValueChange={handleSeasonSelect}
                value={selectedSeason || undefined}
              >
                <SelectTrigger
                  className="text-muted-foreground border-input h-[42px]"
                  id="seasons"
                >
                  <SelectValue placeholder="Select seasons..." />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((currentSeason) => (
                    <SelectItem key={currentSeason} value={currentSeason}>
                      {currentSeason.toUpperCase().charAt(0) +
                        currentSeason.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap w-full justify-start gap-2 py-3">
        {selectedYear && (
          <div
            className="bg-white px-3 py-1 rounded-lg group flex items-center gap-1"
            onClick={() =>
              router.push(pathname + "?" + createQueryString("year", ""))
            }
          >
            <p className="text-sm">{selectedYear}</p>
            <div className="hidden group-hover:block">
              <X className="h-4 w-4 text-muted-foreground" size={16} />
            </div>
          </div>
        )}
        {selectedSeason && (
          <div
            className="bg-white px-3 py-1 rounded-lg group flex items-center gap-1"
            onClick={() =>
              router.push(pathname + "?" + createQueryString("season", ""))
            }
          >
            <p className="text-sm">{selectedSeason}</p>
            <div className="hidden group-hover:block">
              <X className="h-4 w-4 text-muted-foreground" size={16} />
            </div>
          </div>
        )}
        {selectedGenres &&
          selectedGenres.map((genre) => (
            <div
              className="bg-white px-3 py-1 rounded-lg group flex items-center gap-1"
              key={genre + "filter"}
              onClick={() => handleGenreRemove(genre)}
            >
              <p className="text-sm">
                {genres.filter((g) => g.mal_id === Number(genre))[0].name}
              </p>
              <div className="hidden group-hover:block">
                <X className="h-4 w-4 text-muted-foreground" size={16} />
              </div>
            </div>
          ))}
      </div>
      <TabOptions
        display={display}
        setDisplay={setDisplay}
        scroll={false}
        className="pb-2"
      />
      <AnimeDisplay animeData={animes} display={display} />
      <div ref={ref}></div>
    </div>
  );
};

export default SearchFields;
