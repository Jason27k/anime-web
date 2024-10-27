"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarIcon, ExternalLinkIcon, PlayCircleIcon } from "lucide-react";
import { Anime } from "@tutkli/jikan-ts";
import { Media } from "@/utils/anilistTypes";
import { useContext } from "react";
import { LanguageContext, LanguageType } from "@/app/Provider";
import Link from "next/link";

interface AnimeDetailProps {
  anime: Anime;
  aniAnime: Media;
}

export default function AnimeDetails({ anime, aniAnime }: AnimeDetailProps) {
  const languageContext = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState("overview");
  const title =
    (languageContext.language === LanguageType.English
      ? anime.title_english
      : languageContext.language === LanguageType.Romanji
      ? anime.title
      : anime.title_japanese) ?? anime.title;
  const subTitle = title === anime.title ? anime.title : anime.title_japanese;
  const image =
    anime.images.webp?.large_image_url ??
    anime.images.jpg?.large_image_url ??
    anime.images.jpg.image_url;

  const streamingLinks = aniAnime.externalLinks.filter(
    (link) => link.type === "STREAMING"
  );
  const mainStreamingLink =
    streamingLinks.find(
      (link) =>
        link.site === "Crunchyroll" ||
        link.site === "Netflix" ||
        link.site === "HIDIVE"
    ) ?? streamingLinks[0];
  const officialSiteLink = aniAnime.externalLinks.find(
    (link) => link.type === "INFO"
  );

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
                  ({anime.popularity.toLocaleString()} users)
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <Button
                  className="w-full"
                  asChild
                  disabled={
                    mainStreamingLink == null || mainStreamingLink == undefined
                  }
                >
                  <a
                    href={mainStreamingLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PlayCircleIcon className="mr-2 h-4 w-4" /> Watch Now
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                  disabled={
                    officialSiteLink == null || officialSiteLink == undefined
                  }
                >
                  <a
                    href={officialSiteLink?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLinkIcon className="mr-2 h-4 w-4" /> Official Site
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{title}</CardTitle>
              <CardDescription>{subTitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="characters">Characters</TabsTrigger>
                  <TabsTrigger value="staff">Staff</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
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
                      <p>{`${aniAnime.startDate.year}-${aniAnime.startDate.month}-${aniAnime.startDate.day} to ${aniAnime.endDate?.year}-${aniAnime.endDate?.month}-${aniAnime.endDate?.day}`}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Season:</h3>
                      <p>{`${aniAnime.season} ${aniAnime.seasonYear}`}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Duration:</h3>
                      <p>{`${aniAnime.duration} min per ep`}</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="font-semibold mb-2">Genres:</h3>
                    <div className="flex flex-wrap gap-2">
                      {anime.genres.map((genre, index) => (
                        <Link
                          key={index}
                          href={`/search?genres=${genre.mal_id}`}
                        >
                          <Badge variant="secondary">{genre.name}</Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Studios:</h3>
                    <p>
                      {aniAnime.studios.edges
                        .map((edge) => edge.node.name)
                        .join(", ")}
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="characters">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {aniAnime.characterPreview?.edges.map((edge) => (
                      <Card key={edge.id}>
                        <CardContent className="p-4 flex items-center space-x-4">
                          <Image
                            src={edge.node.image.large}
                            alt={edge.node.name.userPreferred}
                            width={80}
                            height={120}
                            className="rounded-md"
                          />
                          <div>
                            <h3 className="font-semibold">
                              {edge.node.name.userPreferred}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {edge.role}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="staff">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {aniAnime.staffPreview?.edges.map((edge) => (
                      <Card key={edge.id}>
                        <CardContent className="p-4 flex items-center space-x-4">
                          <Image
                            src={edge.node.image.large}
                            alt={edge.node.name.userPreferred}
                            width={80}
                            height={120}
                            className="rounded-md"
                          />
                          <div>
                            <h3 className="font-semibold">
                              {edge.node.name.userPreferred}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {edge.role}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Trailer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video">
              <iframe
                src={anime.trailer.embed_url}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {aniAnime.recommendations.nodes.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="flex flex-col items-center"
                >
                  <Image
                    src={recommendation.mediaRecommendation.coverImage.large}
                    alt={recommendation.mediaRecommendation.title.userPreferred}
                    width={150}
                    height={225}
                    className="rounded-md"
                  />
                  <p className="mt-2 text-sm text-center">
                    {recommendation.mediaRecommendation.title.userPreferred}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
