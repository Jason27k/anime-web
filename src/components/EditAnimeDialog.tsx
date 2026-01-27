"use client";

import { useState, useTransition, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateAnimeProgress, removeFromMyListWithRevalidation } from "@/app/actions";
import { AnimeStatus } from "@/lib/api-client";
import { Loader2, Trash2 } from "lucide-react";

interface EditAnimeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animeId: number;
  animeTitle: string;
  currentEpisode: number | null;
  currentStatus: AnimeStatus;
  totalEpisodes: number | null;
  isAnimeFinishedAiring: boolean;
}

export default function EditAnimeDialog({
  open,
  onOpenChange,
  animeId,
  animeTitle,
  currentEpisode,
  currentStatus,
  totalEpisodes,
  isAnimeFinishedAiring,
}: EditAnimeDialogProps) {
  const [episode, setEpisode] = useState(currentEpisode || 1);
  const [status, setStatus] = useState<AnimeStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const maxEpisodes = totalEpisodes || 12;

  // Reset state when dialog opens with new values
  useEffect(() => {
    if (open) {
      setEpisode(currentEpisode || 1);
      setStatus(currentStatus);
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

  const statusOptions: { value: AnimeStatus; label: string; color: string }[] = [
    { value: "WATCHING", label: "Watching", color: "text-blue-400" },
    { value: "COMPLETED", label: "Completed", color: "text-green-400" },
    { value: "DROPPED", label: "Dropped", color: "text-gray-400" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1f232d] border-0 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="line-clamp-2 pr-6">{animeTitle}</DialogTitle>
          <DialogDescription>Update your progress for this anime</DialogDescription>
        </DialogHeader>

        {showDeleteConfirm ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove this anime from your list? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
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
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(value) => handleStatusChange(value as AnimeStatus)}
              >
                <SelectTrigger className="bg-[#191d26] border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#191d26] border-0">
                  {statusOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className={option.color}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {totalEpisodes && totalEpisodes > 1 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Episode Progress</Label>
                  <span className="text-sm text-muted-foreground">
                    {episode} / {maxEpisodes}
                  </span>
                </div>
                <Slider
                  value={[episode]}
                  onValueChange={(value: number[]) => handleEpisodeChange(value[0])}
                  min={1}
                  max={maxEpisodes}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>{maxEpisodes}</span>
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-between pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-400 hover:text-red-300 hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
