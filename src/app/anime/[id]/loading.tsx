import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronDown,
  ExternalLink,
  PlayCircle,
  Star,
  User,
} from "lucide-react";

export default function AnimeDetailsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
        <Skeleton className="absolute inset-0" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="sm:col-span-1 flex flex-col gap-8">
          <Card className="bg-[#1f232d] text-[#7c8793] border-0">
            <CardContent className="p-4">
              <Skeleton className="w-full aspect-[2/3] rounded-lg" />
              <div className="mt-4 flex items-center justify-center space-x-2 text-white">
                <Star className="w-6 h-6 text-yellow-400" />
                <Skeleton className="h-6 w-12" />
                <User className="w-6 h-6 text-yellow-400" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="mt-4 space-y-2">
                <Button className="w-full" disabled>
                  <PlayCircle className="mr-2 h-4 w-4" /> Watch Now
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <ExternalLink className="mr-2 h-4 w-4" /> Official Site
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1f232d] text-[#7c8793] border-0">
            <CardHeader>
              <CardTitle className="text-white">Trailer</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-video w-full" />
            </CardContent>
          </Card>
          <Card className="bg-[#1f232d] text-[#7c8793] border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Anime Links</CardTitle>
              <ChevronDown className="h-6 w-6" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3].map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="sm:col-span-2 flex flex-col gap-8">
          <Tabs defaultValue="overview">
            <TabsList className="w-full bg-[#1f232d] text-[#7c8793] border-0 flex flex-col h-auto min-[380px]:mb-0 min-[380px]:grid min-[380px]:grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="episodes">Episodes</TabsTrigger>
              <TabsTrigger value="characters">Characters</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card className="bg-[#1f232d] text-[#7c8793] border-0">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <div className="grid grid-cols-2 gap-2">
                        {["Episodes", "Duration", "Genres", "Themes"].map(
                          (item, index) => (
                            <div key={index}>
                              <strong>{item}:</strong>
                              <Skeleton className="h-4 w-full mt-1" />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {["episodes", "characters", "staff"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <Card className="bg-[#1f232d] text-[#7c8793] border-0">
                  <CardHeader>
                    <CardTitle>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {[...Array(8)].map((_, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <Skeleton className="w-32 h-44 rounded-lg" />
                          <Skeleton className="h-4 w-24 mt-2" />
                          <Skeleton className="h-3 w-16 mt-1" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
          <Tabs defaultValue="recommendations">
            <TabsList className="w-full bg-[#1f232d] text-[#7c8793] border-0 flex flex-col h-auto min-[380px]:mb-0 min-[380px]:grid min-[380px]:grid-cols-2">
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="related">Related Anime</TabsTrigger>
            </TabsList>
            {["recommendations", "related"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <Card className="bg-[#1f232d] text-[#7c8793] border-0 w-full lg:mt-4">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {[...Array(12)].map((_, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <Skeleton className="w-24 h-36 rounded-md" />
                          <Skeleton className="h-3 w-20 mt-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
