import { fetchAnime } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StarIcon } from "lucide-react";
import Image from "next/image";

const AnimeDetail = async ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return <div>Invalid ID</div>;
  }
  const response = await fetchAnime(id);
  if (!response) {
    return <div>Not Found</div>;
  }

  const anime = response.data;
  const image =
    anime.images.webp?.large_image_url ??
    anime.images.jpg.large_image_url ??
    anime.images.jpg.image_url;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <Image
                src={image}
                alt={anime.title}
                width={350}
                height={500}
                className="w-full h-auto rounded-lg"
              />
              <div className="mt-4 flex items-center justify-center space-x-2">
                <StarIcon className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold">{anime.score}</span>
                <span className="text-sm text-muted-foreground">
                  ({anime.scored_by.toLocaleString()} users)
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{anime.title}</CardTitle>
              <CardDescription>{anime.title_japanese}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">{anime.synopsis}</p>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Type:</h3>
                  <p>{anime.type}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Episodes:</h3>
                  <p>{anime.episodes}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Status:</h3>
                  <p>{anime.status}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Aired:</h3>
                  <p>
                    {anime.aired.from} - {anime.aired.to}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Duration:</h3>
                  <p>{anime.duration}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Rating:</h3>
                  <p>{anime.rating}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h3 className="font-semibold mb-2">Genres:</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre, index) => (
                    <Badge key={index}>{genre.name}</Badge>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Themes:</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.themes.map((theme, index) => (
                    <Badge key={index}>{theme.name}</Badge>
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <h3 className="font-semibold mb-2">Studios:</h3>
                <p>{anime.studios.map((studio) => studio.name).join(", ")}</p>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Producers:</h3>
                <p>
                  {anime.producers.map((producer) => producer.name).join(", ")}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Licensors:</h3>
                <p>
                  {anime.licensors.map((licensor) => licensor.name).join(", ")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {anime.trailer.embed_url && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Trailer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video">
                <iframe
                  src={anime.trailer.embed_url}
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AnimeDetail;
