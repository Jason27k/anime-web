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
import {} from "next/navigation";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export function GenreComboBox({ genres }: { genres: String[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedGenres = searchParams.get("genres");

  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hiddenCount, setHiddenCount] = React.useState(0);

  const returnParamsExcepts = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      return params.toString();
    },
    [searchParams]
  );

  const handleSelect = (currentValue: string) => {
    const newParams = returnParamsExcepts("genres");
    let newGenres = "";
    if (selectedGenres === null) {
      newGenres = currentValue;
    } else {
      newGenres = selectedGenres.split(",").includes(currentValue)
        ? selectedGenres
            .split(",")
            .filter((value) => value !== currentValue)
            .join(",")
        : [...selectedGenres.split(","), currentValue].join(",");
    }
    if (newGenres.length === 0) {
      router.push(`${pathname}?${newParams}`);
      return;
    }
    const updatedUrl = `${pathname}?${newParams}${
      newParams.length > 0 ? "&" : ""
    }genres=${newGenres}`;
    router.push(updatedUrl);
  };

  const handleRemove = (genreToRemove: String) => {
    if (selectedGenres === null) {
      return;
    }
    const prev = selectedGenres.split(",");
    const newSelectedGenres = prev
      .filter((value) => value !== genreToRemove)
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

  React.useEffect(() => {
    const updateHiddenCount = () => {
      if (containerRef.current && selectedGenres && selectedGenres.length > 0) {
        const container = containerRef.current;
        const firstBadge = container.querySelector(
          ".selection-badge"
        ) as HTMLElement;
        const containerWidth = container.offsetWidth - 60;

        if (firstBadge) {
          const firstBadgeWidth = firstBadge.offsetWidth;
          const availableSpace = containerWidth - firstBadgeWidth;

          if (availableSpace < 50) {
            setHiddenCount(selectedGenres.split(",").length - 1);
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

            setHiddenCount(
              Math.max(0, selectedGenres.split(",").length - visibleCount)
            );
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
      <PopoverTrigger asChild className="w-full">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between border-input h-[42px]"
          id="genres"
          asChild
        >
          <div className="">
            <div
              ref={containerRef}
              className="flex items-center gap-1 overflow-hidden text-muted-foreground font-normal"
            >
              {selectedGenres && selectedGenres.length > 0 ? (
                <>
                  <Badge
                    key={selectedGenres[0] + "badge" + selectedGenres}
                    variant="secondary"
                    className="selection-badge mr-1"
                  >
                    {genres.find(
                      (genre) => String(genre) === selectedGenres.split(",")[0]
                    )}
                    <div
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRemove(selectedGenres.split(",")[0]);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleRemove(selectedGenres.split(",")[0])}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </div>
                  </Badge>
                  {hiddenCount > 0 && (
                    <Badge variant="secondary">+{hiddenCount}</Badge>
                  )}
                </>
              ) : (
                "Select genres..."
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-screen md:w-full bg-transparent border-0 px-5 -mt-4 md:px-0 md:mt-0">
        <Command className="w-full">
          <CommandInput placeholder="Search genres..." />
          <CommandList className="w-full">
            <CommandEmpty>No Genre found.</CommandEmpty>
            <CommandGroup className="w-full">
              {genres.map((genre) => (
                <CommandItem
                  key={genre + ""}
                  value={genre + ""}
                  onSelect={() => handleSelect(String(genre))}
                  className="cursor-pointer w-full"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedGenres
                        ?.split(",")
                        .find((selected: String) => selected === genre)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {genre}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
