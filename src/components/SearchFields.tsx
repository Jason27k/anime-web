"use client";

import { Genre } from "@tutkli/jikan-ts";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { SearchIcon } from "lucide-react";
import { GenreComboBox } from "./GenreComboBox";
import { useEffect, useState } from "react";
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
  useEffect(() => {
    console.log(selectedGenres);
  }, [selectedGenres]);

  return (
    <div className="">
      <div className="flex text-white">
        <div className="flex flex-col">
          <Label htmlFor="search">Genre</Label>
          <div className="rounded-md border border-input bg-background flex items-center">
            <SearchIcon className="text-muted-foreground pl-2" size={20} />
            <Input
              placeholder="Search"
              id="search"
              className="inline border-0 pl-1 focus-visible:ring-0 focus-visible:ring-transparent text-black focus-visible:ring-offset-0"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <Label htmlFor="genres">Genres</Label>
          <GenreComboBox
            genres={genres}
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
          />
        </div>
        {/* <div className="flex flex-col">
          <Select>
            <SelectTrigger className="text-muted-foreground">
              <SelectValue placeholder="Genres" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre.mal_id} value={genre.name}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
      </div>
    </div>
  );
};

export default SearchFields;
