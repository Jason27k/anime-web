"use client";

import { Genre } from "@tutkli/jikan-ts";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { SearchIcon } from "lucide-react";
import { GenreComboBox } from "./GenreComboBox";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import * as SelectPrimitive from "@radix-ui/react-select";
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

interface SearchFieldsProps {
  genres: Genre[];
  seasons: string[];
  years: number[];
  formats: string[];
}

const SearchFields = ({
  genres,
  seasons,
  years,
  formats,
}: SearchFieldsProps) => {
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [yearsPopOpen, setYearsPopOpen] = useState(false);
  const [yearsValue, setYearsValue] = useState("");

  useEffect(() => {
    console.log(selectedGenres);
  }, [selectedGenres]);

  return (
    <div className="w-full sm:bg-orange-600 md:bg-red-400 xl:bg-green-600">
      <div className="flex overflow-scroll text-white lg:justify-between gap-2 px-0">
        <div className="flex flex-col flex-1 md:max-w-[250px] lg:max-w-none">
          <Label htmlFor="search">Title</Label>
          <div className="rounded-md border border-input bg-background flex items-center">
            <SearchIcon className="text-muted-foreground pl-2" size={20} />
            <Input
              placeholder="Search"
              id="search"
              className="inline border-0 pl-1 w-42 focus-visible:ring-0 focus-visible:ring-transparent text-black focus-visible:ring-offset-0"
            />
          </div>
        </div>
        <div className="flex"></div>
        <div className="flex flex-col min-w-[150px] xl:min-w-[200px] flex-2">
          <Label htmlFor="genres">Genres</Label>
          <GenreComboBox
            genres={genres}
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
          />
        </div>
        <div className="flex flex-col min-w-[150px] xl:min-w-[200px] flex-2">
          <Label htmlFor="years">Year</Label>
          <Popover open={yearsPopOpen} onOpenChange={setYearsPopOpen}>
            <PopoverTrigger asChild className="">
              <Button
                variant="outline"
                role="combobox"
                className="justify-between border-input h-[42px] text-muted-foreground font-normal group"
                id="years"
              >
                {yearsValue
                  ? years.find((year) => year === Number(yearsValue))
                  : "Select year..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 hidden group-hover:block" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[150px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search years..."
                  className="text-muted-foreground"
                />
                <CommandList>
                  <CommandEmpty>No Year found.</CommandEmpty>
                  <CommandGroup>
                    {years.map((year) => (
                      <CommandItem
                        key={year}
                        value={String(year)}
                        onSelect={(currentValue) => {
                          setYearsValue(
                            currentValue === yearsValue ? "" : currentValue
                          );
                          setYearsPopOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            yearsValue === String(year)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {year}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col min-w-[150px] xl:min-w-[200px] flex-2">
          <Label htmlFor="seasons">Seasons</Label>
          <Select>
            <SelectTrigger
              className="text-muted-foreground border-input h-[42px]"
              id="seasons"
            >
              <SelectValue placeholder="Select seasons..." />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season} value={season}>
                  {season.toUpperCase().charAt(0) + season.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col min-w-[150px] xl:min-w-[200px] flex-2">
          <Label htmlFor="formats">Formats</Label>
          <Select>
            <SelectTrigger
              className="text-muted-foreground border-input h-[42px]"
              id="formats"
            >
              <SelectValue placeholder="Select formats..." />
            </SelectTrigger>
            <SelectContent>
              {formats.map((format) => (
                <SelectItem key={format} value={format}>
                  {format}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchFields;
