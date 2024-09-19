"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Genre } from "@tutkli/jikan-ts";

export function GenreComboBox({
  genres,
  selectedGenres,
  setSelectedGenres,
}: {
  genres: Genre[];
  selectedGenres: Genre[];
  setSelectedGenres: (genres: Genre[]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hiddenCount, setHiddenCount] = React.useState(0);

  const handleSelect = (currentValue: Genre) => {
    setSelectedGenres((prev) =>
      prev.includes(currentValue)
        ? prev.filter((value) => value.mal_id !== currentValue.mal_id)
        : [...prev, currentValue]
    );
  };

  const handleRemove = (valueToRemove: Genre) => {
    setSelectedGenres((prev) =>
      prev.filter((value) => value.mal_id !== valueToRemove.mal_id)
    );
  };

  React.useEffect(() => {
    const updateHiddenCount = () => {
      if (containerRef.current && selectedGenres.length > 0) {
        const container = containerRef.current;
        const firstBadge = container.querySelector(
          ".selection-badge"
        ) as HTMLElement;
        const containerWidth = container.offsetWidth - 60; // Subtract space for dropdown icon and padding

        if (firstBadge) {
          const firstBadgeWidth = firstBadge.offsetWidth;
          const availableSpace = containerWidth - firstBadgeWidth;

          if (availableSpace < 50) {
            // If there's not enough space for "+X" badge
            setHiddenCount(selectedGenres.length - 1);
          } else {
            let totalWidth = firstBadgeWidth;
            let visibleCount = 1;

            const hiddenBadges = Array.from(
              container.querySelectorAll(".selection-badge:not(:first-child)")
            );
            for (const badge of hiddenBadges) {
              const badgeWidth = (badge as HTMLElement).offsetWidth;
              if (totalWidth + badgeWidth + 50 > containerWidth) {
                // 50px for "+X" badge
                break;
              }
              totalWidth += badgeWidth;
              visibleCount++;
            }

            setHiddenCount(Math.max(0, selectedGenres.length - visibleCount));
          }
        } else {
          setHiddenCount(0);
        }
      } else {
        setHiddenCount(0);
      }
    };

    updateHiddenCount();
    window.addEventListener("resize", updateHiddenCount);
    return () => window.removeEventListener("resize", updateHiddenCount);
  }, [selectedGenres]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between border-input h-[42px] w-52"
        >
          <div
            ref={containerRef}
            className="flex items-center gap-1 max-w-[250px] overflow-hidden text-muted-foreground font-normal"
          >
            {selectedGenres.length > 0 ? (
              <>
                <Badge
                  key={selectedGenres[0].mal_id}
                  variant="secondary"
                  className="selection-badge mr-1"
                >
                  {
                    genres.find(
                      (genre) => genre.mal_id === selectedGenres[0].mal_id
                    )?.name
                  }
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRemove(selectedGenres[0]);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleRemove(selectedGenres[0])}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
                {hiddenCount > 0 && (
                  <Badge variant="secondary">+{hiddenCount}</Badge>
                )}
              </>
            ) : (
              "Select frameworks..."
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {genres.map((genre) => (
                <CommandItem
                  key={genre.mal_id}
                  value={genre.name}
                  onSelect={() => handleSelect(genre)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedGenres.includes(genre)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {genre.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
