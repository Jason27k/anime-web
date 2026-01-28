import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  PlayCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function MyAnimeListLoading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Skeleton */}
        <aside className="w-full md:w-64 lg:w-72 md:shrink-0">
          <div className="md:sticky md:top-20 space-y-4">
            {/* Profile Card Skeleton */}
            <Card className="bg-[#1f232d] border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-full bg-[#191d26]" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 bg-[#191d26] mb-2" />
                    <Skeleton className="h-4 w-24 bg-[#191d26]" />
                  </div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Skeleton className="h-16 rounded-lg bg-[#191d26]" />
                  <Skeleton className="h-16 rounded-lg bg-[#191d26]" />
                  <Skeleton className="h-16 rounded-lg bg-[#191d26]" />
                  <Skeleton className="h-16 rounded-lg bg-[#191d26]" />
                </div>

                {/* Mobile Settings Button Skeleton */}
                <div className="md:hidden mt-4">
                  <Skeleton className="h-10 w-full rounded-md bg-[#191d26]" />
                </div>
              </CardContent>
            </Card>

            {/* Settings Card Skeleton - Desktop only */}
            <Card className="bg-[#1f232d] border-0 hidden md:block">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-20 bg-[#191d26]" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full rounded-md bg-[#191d26]" />
                <Skeleton className="h-10 w-full rounded-md bg-[#191d26]" />
                <Skeleton className="h-10 w-full rounded-md bg-[#191d26]" />
              </CardContent>
            </Card>

            {/* Account Card Skeleton - Desktop only */}
            <Card className="bg-[#1f232d] border-0 hidden md:block">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-20 bg-[#191d26]" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-10 w-full rounded-md bg-[#191d26]" />
                <Skeleton className="h-10 w-full rounded-md bg-[#191d26]" />
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 space-y-4">
          {/* Tab Navigation Skeleton */}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="bg-primary text-white" disabled>
              <LayoutGrid className="mr-2 h-4 w-4" />
              All
            </Button>
            <Button size="sm" className="bg-[#191d26] text-muted-foreground" disabled>
              <PlayCircle className="mr-2 h-4 w-4" />
              Watching
            </Button>
            <Button size="sm" className="bg-[#191d26] text-muted-foreground" disabled>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Completed
            </Button>
            <Button size="sm" className="bg-[#191d26] text-muted-foreground" disabled>
              <XCircle className="mr-2 h-4 w-4" />
              Dropped
            </Button>
          </div>

          {/* Anime Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, index) => (
              <AnimeCardSkeleton key={index} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function AnimeCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 bg-[#1f232d] flex flex-col">
      {/* Image Skeleton */}
      <Skeleton className="w-full aspect-[3/4] bg-[#191d26]" />

      {/* Content Skeleton */}
      <CardContent className="p-3 flex-1">
        <Skeleton className="h-4 w-full bg-[#191d26] mb-2" />
        <Skeleton className="h-4 w-2/3 bg-[#191d26] mb-2" />
        <Skeleton className="h-3 w-1/2 bg-[#191d26]" />
      </CardContent>

      {/* Footer Skeleton */}
      <div className="p-3 pt-0">
        <Skeleton className="h-8 w-full rounded-md bg-[#191d26]" />
      </div>
    </Card>
  );
}
