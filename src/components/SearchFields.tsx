"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { SearchIcon, X } from "lucide-react";
import { GenreComboBox } from "./GenreComboBox";
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
import { fetchSearch, SearchQueryVariables } from "@/app/actions";
import { capitalize } from "@/utils/formatting";
import { TabsTrigger, TabsContent } from "./ui/tabs";
import { useInfiniteQuery } from "@tanstack/react-query";

interface SearchFieldsProps {
  genres: String[];
  seasons: string[];
  years: number[];
  className?: string;
  loggedIn: boolean;
  ids: number[];
  searchParams: { [key: string]: string | undefined } | undefined;
}

const TabTriggerFilters = () => {
  return <TabsTrigger value="filters">Filters</TabsTrigger>;
};

const TabContentFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const options = [
    "Title (English)",
    "Title (Native)",
    "Title (Romaji)",
    "Popularity",
    "Score",
    "Trending",
  ];
  const optionsMap = {
    "Title (English)": "TITLE_ENGLISH",
    "Title (Native)": "TITLE_NATIVE",
    "Title (Romaji)": "TITLE_ROMAJI",
    Popularity: "POPULARITY_DESC",
    Score: "SCORE_DESC",
    Trending: "TRENDING_DESC",
  };
  const sort = searchParams.get("sort");

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

  const handleClearFilters = () => {
    const newParams = new URLSearchParams();
    router.push(pathname + "?" + newParams.toString());
  };

  const handleSortSelect = (sort: string) => {
    router.push(pathname + "?" + createQueryString("sort", sort));
  };

  const handleSortRemove = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("sort");
    router.push(pathname + "?" + newParams.toString());
  };
  return (
    <TabsContent value="filters" className="border-0 py-2 md:py-0">
      <div className="flex justify-center items-center gap-2">
        <Button
          onClick={handleSortRemove}
          className="bg-white hover:bg-white"
          disabled={!sort}
        >
          <X className="h-4 w-4 text-[#d67900]" size={16} />
        </Button>
        <Select onValueChange={handleSortSelect} value={sort || undefined}>
          <SelectTrigger className="text-muted-foreground border-input">
            <SelectValue placeholder="Select Sort..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option}
                value={optionsMap[option as keyof typeof optionsMap]}
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          className="bg-[#d67900] text-white px-2 py-1 rounded-md"
          onClick={handleClearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </TabsContent>
  );
};

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
  const [display, setDisplay] = useState<0 | 1 | 2 | 3>(3);

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
      const params = new URLSearchParams(searchParams?.toString());
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
      const params = new URLSearchParams(searchParams?.toString());
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
      const params = new URLSearchParams(searchParams?.toString());
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
                      {capitalize(currentSeason)}
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
              selectedSeason
                ? null
                : router.push(pathname + "?" + createQueryString("year", ""))
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
            <p className="text-sm">{capitalize(selectedSeason)}</p>
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
              <p className="text-sm">{genre}</p>
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
        className="pb-2 min-[990px]:mt-10 min-[1024px]:mt-0"
        defaultValue="filters"
        tabTriggers={<TabTriggerFilters />}
        tabContents={<TabContentFilters />}
      />
      <AnimeDisplay
        display={display}
        animeData={data?.pages.flatMap((page) => page.data.Page.media) || []}
        loggedIn={loggedIn}
        ids={ids}
      />
      <div ref={ref}>
        {hasNextPage && (
          <div className="flex justify-center items-center w-full h-16">
            <p className="text-white">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFields;
