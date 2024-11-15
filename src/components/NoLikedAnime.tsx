import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, Search, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const NoLikedAnime = () => {
  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-md bg-[#1f232d] border-0 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Start Your Anime Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="rounded-full p-2 bg-[#d67900] text-white">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <p className="text-sm">
              Like anime to build your personal collection
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-full p-2 bg-[#d67900] text-white">
              <ThumbsUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <p className="text-sm">
              Get better recommendations based on your likes
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-full p-2 bg-[#d67900] text-white">
              <Search className="h-6 w-6 text-primary-foreground" />
            </div>
            <p className="text-sm">Discover new anime that match your taste</p>
          </div>
          <div className="text-center mt-6">
            <p className="text-slate-400">
              Start liking anime to personalize your experience!
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full bg-[#d67900] text-white">
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" /> Explore Anime
            </Link>
          </Button>
          <Button
            asChild
            className="w-full bg-[#1f1f1f] text-[#d67900] hover:text-white"
          >
            <Link href="/search?sort=TRENDING_DESC">View Trending Anime</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoLikedAnime;
