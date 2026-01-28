"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { updateAnimeProgress, removeFromMyListWithRevalidation } from "@/app/actions";
import { AnimeStatus } from "@/lib/api-client";
import { Loader2, Trash2, Check, Play, X } from "lucide-react";

interface EditAnimeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animeId: number;
  animeTitle: string;
  currentEpisode: number | null;
  currentStatus: AnimeStatus;
  totalEpisodes: number | null;
  isAnimeFinishedAiring: boolean;
  coverImage?: string;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export default function EditAnimeSheet({
  open,
  onOpenChange,
  animeId,
  animeTitle,
  currentEpisode,
  currentStatus,
  totalEpisodes,
  isAnimeFinishedAiring,
  coverImage,
}: EditAnimeSheetProps) {
  const [episode, setEpisode] = useState(currentEpisode || 1);
  const [status, setStatus] = useState<AnimeStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const maxEpisodes = totalEpisodes || 12;

  // Reset state when dialog/sheet opens with new values
  useEffect(() => {
    if (open) {
      setEpisode(currentEpisode || 1);
      setStatus(currentStatus);
      setShowDeleteConfirm(false);
    }
  }, [open, currentEpisode, currentStatus]);

  // When status changes to COMPLETED, set episode to max
  const handleStatusChange = (newStatus: AnimeStatus) => {
    setStatus(newStatus);
    if (newStatus === "COMPLETED" && totalEpisodes) {
      setEpisode(totalEpisodes);
    }
  };

  // When episode reaches max and anime is finished airing, auto-complete
  const handleEpisodeChange = (newEpisode: number) => {
    setEpisode(newEpisode);
    if (
      newEpisode === maxEpisodes &&
      isAnimeFinishedAiring &&
      totalEpisodes &&
      status !== "COMPLETED"
    ) {
      setStatus("COMPLETED");
    }
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateAnimeProgress(animeId, episode, status);
      if (result.success) {
        onOpenChange(false);
      }
    });
  };

  const handleDelete = () => {
    setIsDeleting(true);
    startTransition(async () => {
      const result = await removeFromMyListWithRevalidation(animeId);
      if (result.success) {
        onOpenChange(false);
      }
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    });
  };

  const statusOptions: { value: AnimeStatus; label: string; icon: typeof Play; activeClass: string }[] = [
    { value: "WATCHING", label: "Watching", icon: Play, activeClass: "bg-blue-600 text-white border-blue-600" },
    { value: "COMPLETED", label: "Completed", icon: Check, activeClass: "bg-green-600 text-white border-green-600" },
    { value: "DROPPED", label: "Dropped", icon: X, activeClass: "bg-zinc-600 text-white border-zinc-600" },
  ];

  const deleteConfirmContent = (
    <div className="space-y-4 py-4">
      <p className="text-sm text-muted-foreground">
        Are you sure you want to remove this anime from your list?
      </p>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setShowDeleteConfirm(false)}
          disabled={isDeleting}
          className="flex-1 border-[#2a2f3a] bg-transparent hover:bg-[#252a36]"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 bg-red-600 hover:bg-red-700"
        >
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Removing...
            </>
          ) : (
            "Remove"
          )}
        </Button>
      </div>
    </div>
  );

  const editContent = (
    <div className="space-y-6 py-4">
      {/* Status Selection */}
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Status</Label>
        <div className="grid grid-cols-3 gap-2">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            const isActive = status === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                  isActive
                    ? option.activeClass
                    : "border-[#2a2f3a] bg-[#1f232d] text-muted-foreground hover:border-[#3a3f4a]"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Episode Progress */}
      {totalEpisodes && totalEpisodes > 1 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-sm text-muted-foreground">Episode Progress</Label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEpisodeChange(Math.max(1, episode - 1))}
                className="w-8 h-8 rounded-lg bg-[#1f232d] border border-[#2a2f3a] text-white hover:bg-[#252a36] transition-colors flex items-center justify-center disabled:opacity-50"
                disabled={episode <= 1}
              >
                −
              </button>
              <span className="text-lg font-semibold text-white min-w-16 text-center">
                {episode} / {maxEpisodes}
              </span>
              <button
                onClick={() => handleEpisodeChange(Math.min(maxEpisodes, episode + 1))}
                className="w-8 h-8 rounded-lg bg-[#1f232d] border border-[#2a2f3a] text-white hover:bg-[#252a36] transition-colors flex items-center justify-center disabled:opacity-50"
                disabled={episode >= maxEpisodes}
              >
                +
              </button>
            </div>
          </div>
          <Slider
            value={[episode]}
            onValueChange={(value: number[]) => handleEpisodeChange(value[0])}
            min={1}
            max={maxEpisodes}
            step={1}
            className="w-full"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-red-400 hover:text-red-300 hover:bg-red-950/50 shrink-0"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
        <Button
          onClick={handleSave}
          disabled={isPending}
          className="flex-1 bg-primary hover:bg-primary/90 h-11"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );

  // Desktop: Centered solid modal
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#1a1d24] border border-[#2a2f3a] max-w-lg p-6 rounded-2xl">
          <DialogHeader className="text-left space-y-4">
            <div className="flex gap-4">
              {coverImage && (
                <img
                  src={coverImage}
                  alt={animeTitle}
                  className="w-24 h-36 object-cover rounded-xl shrink-0 shadow-lg"
                />
              )}
              <div className="flex-1 min-w-0 pt-2">
                <DialogTitle className="text-white text-xl leading-tight line-clamp-2">
                  {animeTitle}
                </DialogTitle>
                <DialogDescription className="mt-2 text-muted-foreground">
                  Update your progress
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {showDeleteConfirm ? deleteConfirmContent : editContent}
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile: Bottom sheet
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="bg-[#1a1d24] border-t border-[#2a2f3a] rounded-t-2xl max-h-[85vh] overflow-y-auto"
      >
        <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-zinc-700 mb-4" />

        <SheetHeader className="text-left pb-4">
          <div className="flex gap-4">
            {coverImage && (
              <img
                src={coverImage}
                alt={animeTitle}
                className="w-16 h-24 object-cover rounded-lg shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-white line-clamp-2 text-lg">
                {animeTitle}
              </SheetTitle>
              <SheetDescription className="mt-1">
                Update your progress
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {showDeleteConfirm ? deleteConfirmContent : editContent}
      </SheetContent>
    </Sheet>
  );
}
