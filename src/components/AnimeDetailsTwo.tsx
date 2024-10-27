"use client";
import { useState, useContext } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlayCircleIcon,
  StarIcon,
  ExternalLinkIcon,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Anime } from "@tutkli/jikan-ts";
import { Media } from "@/utils/anilistTypes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LanguageContext, LanguageType } from "@/app/Provider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";

interface AnimeDetailPropsTwo {
  anime: Anime;
  aniAnime: Media;
}

export default function AnimeDetailsTwo({
  anime,
  aniAnime,
}: AnimeDetailPropsTwo) {
  const languageContext = useContext(LanguageContext);
  const [linkCollapsed, setLinkCollapsed] = useState(false);
  const title =
    (languageContext.language === LanguageType.English
      ? anime.title_english
      : languageContext.language === LanguageType.Romanji
      ? anime.title
      : anime.title_japanese) ?? anime.title;
  const subTitle =
    title === anime.title
      ? anime.title_english ?? anime.title_japanese
      : anime.title;
  const [selectedEpisode, setSelectedEpisode] = useState(
    aniAnime.streamingEpisodes[0]
  );
  const image =
    anime.images.webp?.large_image_url ??
    anime.images.jpg.large_image_url ??
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
    <div className="container mx-auto px-4 py-8 ">
      <div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
        <Image
          src={aniAnime.bannerImage || anime.images.jpg.image_url}
          alt={anime.title}
          layout="fill"
          objectFit="cover"
          className="brightness-50"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{title}</h1>
          <p className="text-xl md:text-2xl">{subTitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="sm:col-span-1 flex flex-col gap-8">
          <Card className="bg-[#1f232d] text-[#7c8793] border-0">
            <CardContent className="p-4">
              <Image
                src={image}
                alt={anime.title}
                width={350}
                height={500}
                className="w-full max-w-56 max-h-96 aspect-auto sm:h-auto rounded-lg mx-auto"
              />
              <div className="mt-4 flex items-center justify-center space-x-2 text-white">
                <StarIcon className="w-6 h-6 text-yellow-400" />
                <span className="text-xl font-bold">{anime.score}</span>
                <User className="w-6 h-6 text-yellow-400" />
                <span className="text-xl font-bold">
                  {anime.members > 1000000
                    ? Math.floor(anime.members / 100000) / 10 + "M"
                    : Math.floor(anime.members / 1000) + "K"}{" "}
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
          <Card className="bg-[#1f232d] text-[#7c8793] border-0">
            <CardHeader>
              <CardTitle className="text-white">Trailer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video">
                <iframe
                  src={anime.trailer.embed_url}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                ></iframe>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1f232d] text-[#7c8793] border-0">
            <Collapsible open={linkCollapsed} onOpenChange={setLinkCollapsed}>
              <CollapsibleTrigger className="w-full flex items-center justify-start">
                <CardHeader className="w-full">
                  <CardTitle className="text-white text-start">
                    Anime Links
                  </CardTitle>
                </CardHeader>
                {linkCollapsed ? (
                  <ChevronUp className="h-6 w-6 mr-2" />
                ) : (
                  <ChevronDown className="h-6 w-6 mr-2" />
                )}
              </CollapsibleTrigger>
              <CardContent>
                <CollapsibleContent className="space-y-2">
                  {aniAnime.externalLinks.map((link, index) => (
                    <Button
                      key={index}
                      className="w-full"
                      variant="outline"
                      asChild
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLinkIcon className="mr-2 h-4 w-4" />{" "}
                        {link.site}
                      </a>
                    </Button>
                  ))}
                </CollapsibleContent>
              </CardContent>
            </Collapsible>
          </Card>
        </div>
        <div className="sm:col-span-2 flex flex-col gap-8">
          <Tabs defaultValue="overview">
            <TabsList
              className={cn(
                `w-full bg-[#1f232d] text-[#7c8793] border-0 flex flex-col h-auto min-[380px]:mb-0 min-[380px]:grid`,
                selectedEpisode
                  ? "min-[380px]:grid-cols-4"
                  : "min-[380px]:grid-cols-3"
              )}
            >
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {selectedEpisode && (
                <TabsTrigger value="episodes">Episodes</TabsTrigger>
              )}
              <TabsTrigger value="characters">Characters</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card className="bg-[#1f232d] text-[#7c8793] border-0">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center mb-4"></div>
                      <p className="mb-4">{anime.synopsis}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <strong>Episodes:</strong> {anime.episodes}
                        </div>
                        <div>
                          <strong>Duration:</strong> {anime.duration} min
                        </div>
                        <div>
                          <strong>Genres:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
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
                        <div>
                          <strong>Themes:</strong>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {anime.themes.map((theme, index) => (
                              <Badge key={index} variant="secondary">
                                {theme.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {selectedEpisode && (
              <TabsContent value="episodes">
                <Card className="bg-[#1f232d] text-[#7c8793] border-0">
                  <CardHeader>
                    <CardTitle>Episodes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="aspect-video relative">
                        <Image
                          src={selectedEpisode.thumbnail}
                          alt={selectedEpisode.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button asChild>
                            <a
                              href={selectedEpisode.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <PlayCircleIcon className="mr-2 h-4 w-4" /> Watch
                              Now
                            </a>
                          </Button>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {selectedEpisode.title}
                        </h3>
                        <p className="text-muted-foreground">
                          Watch the latest episode on {selectedEpisode.site}
                        </p>
                      </div>
                    </div>
                    <ScrollArea className="h-[400px]">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {aniAnime.streamingEpisodes.map((episode, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center p-2 rounded-lg hover:bg-accent cursor-pointer"
                            onClick={() => setSelectedEpisode(episode)}
                          >
                            <Image
                              src={episode.thumbnail}
                              alt={episode.title}
                              width={160}
                              height={90}
                              className="rounded"
                            />
                            <p className="text-sm font-medium mt-2 text-center">
                              {episode.title}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
            <TabsContent value="characters">
              <Card className="bg-[#1f232d] text-[#7c8793] border-0">
                <CardHeader>
                  <CardTitle>Characters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {aniAnime.characterPreview?.edges.map((character) => (
                      <div
                        key={character.id}
                        className="flex flex-col items-center"
                      >
                        <Image
                          src={character.node.image.large}
                          alt={character.node.name.userPreferred}
                          width={150}
                          height={200}
                          className="rounded-lg"
                        />
                        <h3 className="mt-2 font-semibold text-center">
                          {character.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {character.role}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="staff">
              <Card className="bg-[#1f232d] text-[#7c8793] border-0">
                <CardHeader>
                  <CardTitle>Staff</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {aniAnime.staffPreview?.edges.map((person) => (
                      <div
                        key={person.id}
                        className="flex flex-col items-center"
                      >
                        <Image
                          src={person.node.image.large}
                          alt={person.node.name.userPreferred}
                          width={150}
                          height={200}
                          className="rounded-lg"
                        />
                        <h3 className="mt-2 font-semibold text-center">
                          {person.node.name.userPreferred}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {person.role}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <Tabs defaultValue="recommendations">
            <TabsList className=" w-full bg-[#1f232d] text-[#7c8793] border-0 flex flex-col h-auto min-[380px]:mb-0 min-[380px]:grid min-[380px]:grid-cols-2">
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="related">Related Anime</TabsTrigger>
            </TabsList>
            <TabsContent value="related">
              <Card className="bg-[#1f232d] text-[#7c8793] border-0 w-full lg:mt-4">
                <CardHeader>
                  <CardTitle className="text-white">Related Anime</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="grid justify-evenly gap-4 w-full"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(130px, 1fr))",
                    }}
                  >
                    {aniAnime.relations.edges
                      .filter(
                        (rel) =>
                          rel.node.format === "TV" &&
                          rel.node.idMal &&
                          rel.relationType !== "CHARACTER"
                      )
                      .map((rec) => (
                        <Link
                          href={"/anime/" + rec.node.idMal}
                          key={rec.id}
                          className="flex flex-col items-center"
                        >
                          <Image
                            src={rec.node.coverImage.large}
                            alt={rec.node.title.userPreferred}
                            width={100}
                            height={150}
                            className="rounded-md"
                          />
                          <p className="text-sm text-center mt-2">
                            {rec.node.title.userPreferred}
                          </p>
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="recommendations">
              <Card className="bg-[#1f232d] text-[#7c8793] border-0 w-full lg:mt-4">
                <CardHeader>
                  <CardTitle className="text-white">Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="grid justify-evenly gap-4 w-full"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(130px, 1fr))",
                    }}
                  >
                    {aniAnime.recommendations.nodes
                      .filter(
                        (rec) =>
                          rec.mediaRecommendation.format === "TV" &&
                          rec.mediaRecommendation.type === "ANIME" &&
                          rec.mediaRecommendation.idMal
                      )
                      .map((rec) => (
                        <Link
                          href={"/anime/" + rec.mediaRecommendation.idMal}
                          key={rec.id}
                          className="flex flex-col items-center"
                        >
                          <Image
                            src={rec.mediaRecommendation.coverImage.large}
                            alt={rec.mediaRecommendation.title.userPreferred}
                            width={100}
                            height={150}
                            className="rounded-md"
                          />
                          <p className="text-sm text-center mt-2">
                            {rec.mediaRecommendation.title.userPreferred}
                          </p>
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
