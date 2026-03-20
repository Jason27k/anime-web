"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { SearchIcon, X } from "lucide-react";
import { GenreComboBox } from "./GenreComboBox";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { fetchSearch, SearchQueryVariables } from "@/app/actions";
import { capitalize } from "@/utils/formatting";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowUpDown } from "lucide-react";

interface SearchFieldsProps {
  genres: String[];
  seasons: string[];
  years: number[];
  className?: string;
  loggedIn: boolean;
  ids: number[];
  searchParams: { [key: string]: string | undefined } | undefined;
}

const sortOptions = [
  { label: "Title (English)", value: "TITLE_ENGLISH" },
  { label: "Title (Romaji)", value: "TITLE_ROMAJI" },
  { label: "Popularity", value: "POPULARITY_DESC" },
  { label: "Score", value: "SCORE_DESC" },
  { label: "Trending", value: "TRENDING_DESC" },
];

const SearchFields = ({
  genres,
  seasons,
  years,
  className,
  loggedIn,
  ids,
  searchParams,
}: SearchFieldsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { ref, inView } = useInView();
  const selectedYear = searchParams?.year;
  const selectedSeason = searchParams?.season;
  const selectedGenres = searchParams?.genres?.split(",");
  const sort = searchParams?.sort;
  const [yearsPopOpen, setYearsPopOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams?.query || "");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data, error, fetchNextPage, hasNextPage, isFetching, isPending } =
    useInfiniteQuery({
      queryKey: ["animes", searchParams],
      queryFn: ({ pageParam }) => {
        const newVars: SearchQueryVariables = {
          page: pageParam,
          genres: selectedGenres ?? undefined,
          year: selectedSeason ? undefined : selectedYear ?? undefined,
          search: searchQuery === "" ? undefined : searchQuery ?? undefined,
          season:
            (selectedSeason as "WINTER" | "SPRING" | "SUMMER" | "FALL") ??
            undefined,
          seasonYear: selectedSeason
            ? selectedYear
              ? Number(selectedYear)
              : new Date().getFullYear()
            : undefined,
          sort: sort ? [sort] : undefined,
        };
        return fetchSearch(newVars);
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.data.Page.pageInfo.hasNextPage) {
          return pages.length + 1;
        }
      },
      getPreviousPageParam: (firstPage, pages) => {
        if (firstPage.data.Page.pageInfo.currentPage > 1) {
          return pages.length - 1;
        }
      },
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  if (isPending) {
    console.log("pending");
  }

  if (isFetching) {
    console.log("fetching");
  }

  if (error) {
    return (
      <div>
        <p>Error</p>
      </div>
    );
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(
        Object.entries(searchParams ?? {}).filter((e): e is [string, string] => e[1] !== undefined)
      );
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
      const params = new URLSearchParams(
        Object.entries(searchParams ?? {}).filter((e): e is [string, string] => e[1] !== undefined)
      );
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
      const params = new URLSearchParams(
        Object.entries(searchParams ?? {}).filter((e): e is [string, string] => e[1] !== undefined)
      );
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
      if (searchParams?.query) {
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
    if (searchParams?.year) {
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

  const hasActiveFilters = selectedYear || selectedSeason || (selectedGenres && selectedGenres.length > 0) || sort;

  return (
    <div className={cn(className, "w-full")}>
      {/* Page header */}
      <header className="mb-10">
        <div className="flex items-baseline gap-4 mb-2">
          <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase">Discover</span>
          <div className="h-px flex-grow bg-gradient-to-r from-primary/30 to-transparent" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-3">BROWSE</h1>
        <p className="text-muted-foreground max-w-xl leading-relaxed">
          Search and filter the full anime catalogue.
        </p>
      </header>

      {/* Filter bar */}
      <div className="bg-surface-container-low rounded-2xl p-4 md:p-6 mb-4">
        <div className="flex flex-wrap lg:flex-nowrap gap-3">
          {/* Title search */}
          <div className="flex flex-col gap-1.5 w-full lg:max-w-none">
            <Label htmlFor="search" className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase">Title</Label>
            <div className="rounded-lg border border-outline-variant/30 bg-surface-container flex items-center w-full focus-within:border-primary/50 transition-colors">
              <SearchIcon className="text-muted-foreground ml-3 shrink-0" size={16} />
              <Input
                placeholder="Search titles..."
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent pl-2 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex w-full justify-between flex-wrap md:flex-nowrap gap-3">
            {/* Genres */}
            <div className="flex flex-col gap-1.5 w-full">
              <Label htmlFor="genres" className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase">Genres</Label>
              <GenreComboBox genres={genres} />
            </div>

            {/* Year */}
            <div className="flex flex-col gap-1.5 w-full">
              <Label htmlFor="years" className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase">Year</Label>
              <Popover open={yearsPopOpen} onOpenChange={setYearsPopOpen}>
                <PopoverTrigger asChild className="w-full">
                  <Button
                    variant="outline"
                    role="combobox"
                    className="justify-between border-outline-variant/30 bg-surface-container h-[42px] text-muted-foreground font-normal hover:bg-surface-container-high hover:text-foreground transition-colors group"
                    id="years"
                  >
                    {selectedYear ? selectedYear : "Select year..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 hidden group-hover:block" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-screen md:w-full bg-transparent border-0 px-5 -mt-4 md:px-0 md:mt-0">
                  <Command value={selectedYear || undefined} className="w-full">
                    <CommandInput placeholder="Search years..." className="text-muted-foreground w-full" />
                    <CommandList className="w-full">
                      <CommandEmpty>No year found.</CommandEmpty>
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
                                selectedYear === String(currentYear) ? "opacity-100" : "opacity-0"
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

            {/* Season */}
            <div className="flex flex-col gap-1.5 w-full">
              <Label htmlFor="seasons" className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase">Season</Label>
              <Select onValueChange={handleSeasonSelect} value={selectedSeason || undefined}>
                <SelectTrigger
                  className="text-muted-foreground border-outline-variant/30 bg-surface-container h-[42px] hover:bg-surface-container-high transition-colors"
                  id="seasons"
                >
                  <SelectValue placeholder="Select season..." />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((currentSeason) => (
                    <SelectItem key={currentSeason} value={currentSeason}>
                      {capitalize(currentSeason)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap w-full justify-start gap-2 pb-2">
          {selectedYear && (
            <button
              className="flex items-center gap-1.5 bg-surface-container-high border border-outline-variant/20 px-3 py-1 rounded-full text-sm text-foreground hover:border-primary/40 transition-colors group"
              onClick={() => !selectedSeason && router.push(pathname + "?" + createQueryString("year", ""))}
            >
              {selectedYear}
              {!selectedSeason && <X className="h-3 w-3 text-muted-foreground group-hover:text-primary" />}
            </button>
          )}
          {selectedSeason && (
            <button
              className="flex items-center gap-1.5 bg-surface-container-high border border-outline-variant/20 px-3 py-1 rounded-full text-sm text-foreground hover:border-primary/40 transition-colors group"
              onClick={() => router.push(pathname + "?" + createQueryString("season", ""))}
            >
              {capitalize(selectedSeason)}
              <X className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
            </button>
          )}
          {selectedGenres?.map((genre) => (
            <button
              key={genre + "filter"}
              className="flex items-center gap-1.5 bg-surface-container-high border border-outline-variant/20 px-3 py-1 rounded-full text-sm text-foreground hover:border-primary/40 transition-colors group"
              onClick={() => handleGenreRemove(genre)}
            >
              {genre}
              <X className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
            </button>
          ))}
        </div>
      )}

      {/* Sort row */}
      <div className="flex items-center gap-2 pb-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-bold uppercase tracking-[0.15em]">
          <ArrowUpDown size={12} />
          Sort
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                router.push(
                  pathname + "?" + createQueryString("sort", sort === option.value ? "" : option.value)
                )
              }
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                sort === option.value
                  ? "bg-primary text-background"
                  : "bg-surface-container-high text-muted-foreground hover:text-foreground border border-outline-variant/20"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <AnimeDisplay
        animeData={data?.pages.flatMap((page) => page.data.Page.media) || []}
        loggedIn={loggedIn}
        ids={ids}
      />
      <div ref={ref}>
        {hasNextPage && (
          <div className="flex justify-center items-center w-full h-16">
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Loading more...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFields;
