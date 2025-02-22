"use client";
import { useState, useContext } from "react";
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
import { Media } from "@/utils/anilistTypes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LanguageContext, LanguageType } from "@/app/Provider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { removefromMyList, addToMyList } from "@/app/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AnimeDetailPropsTwo {
  anime: Media;
  loggedIn: boolean;
  liked: boolean;
}

export default function AnimeDetailsTwo({
  anime,
  loggedIn,
  liked,
}: AnimeDetailPropsTwo) {
  const languageContext = useContext(LanguageContext);
  const [linkCollapsed, setLinkCollapsed] = useState(false);
  const title =
    (languageContext.language === LanguageType.English
      ? anime.title.english
      : languageContext.language === LanguageType.Romanji
      ? anime.title.romaji
      : anime.title.native) ?? anime.title.romaji;
  const subTitle =
    title === anime.title.romaji
      ? anime.title.english ?? anime.title.native
      : anime.title.romaji;
  const [selectedEpisode, setSelectedEpisode] = useState(
    anime.streamingEpisodes[0]
  );

  if (!anime) return <>Error</>;

  const image = anime.coverImage.extraLarge;
  const streamingLinks = anime.externalLinks.filter(
    (link) => link.type === "STREAMING"
  );
  const mainStreamingLink =
    streamingLinks.find(
      (link) =>
        link.site === "Crunchyroll" ||
        link.site === "Netflix" ||
        link.site === "HIDIVE"
    ) ?? streamingLinks[0];
  const officialSiteLink = anime.externalLinks.find(
    (link) => link.type === "INFO"
  );

  const score = anime.averageScore ? anime.averageScore / 10 : "N/A";

  const testWithIDWatching = addToMyList.bind(null, anime.id, "watching", true);
  const testWithIDFinished = addToMyList.bind(null, anime.id, "finished", true);
  const removeWithId = removefromMyList.bind(null, anime.id, true);
  console.log(anime.episodes);

  return (
    <div className="container mx-auto px-4 py-2 sm:py-4 ">
      {anime.bannerImage ? (
        <>
          <div className="hidden sm:block">
            <div className="relative h-64 sm:h-96 mb-8 rounded-xl overflow-hidden">
              <img
                src={anime.bannerImage}
                alt={title}
                className="brightness-50 h-full w-full bg-[#191d26] mx-auto"
                loading="lazy"
              />
              <div className="absolute inset-0 flex flex-col justify-end px-6 text-white h-full">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{title}</h1>
                <p className="text-xl md:text-2xl">{subTitle}</p>
                <div className="h-6"></div>
              </div>
            </div>
          </div>

          <div className="block sm:hidden">
            <div className="text-white mb-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{title}</h1>
              <p className="text-xl md:text-2xl">{subTitle}</p>
            </div>
            <div className="relative h-full mb-4 rounded-xl overflow-hidden">
              <img
                src={anime.bannerImage}
                alt={title}
                className="brightness-50 aspect-video bg-[#191d26] mx-auto"
                loading="lazy"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-centert text-center sm:text-start sm:justify-end px-6 text-white h-full">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{title}</h1>
          <p className="text-xl md:text-2xl">{subTitle}</p>
          <div className="h-6"></div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="sm:col-span-1 flex flex-col gap-8">
          <Card className="bg-[#1f232d] text-[#7c8793] border-0">
            <CardContent className="p-4">
              <img
                src={image}
                alt={title}
                width={350}
                height={500}
                className="w-full max-w-56 max-h-96 aspect-auto sm:h-auto rounded-lg mx-auto bg-[#191d26]"
              />
              <div className="mt-4 flex items-center justify-center space-x-2 text-white">
                <StarIcon className="w-6 h-6 text-yellow-400" />
                <span className="text-xl font-bold">{score}</span>
                <User className="w-6 h-6 text-yellow-400" />
                <span className="text-xl font-bold">
                  {anime.popularity > 1000000
                    ? Math.floor(anime.popularity / 100000) / 10 + "M"
                    : Math.floor(anime.popularity / 1000) + "K"}{" "}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <Button
                  className="w-full"
                  asChild
                  variant={
                    !mainStreamingLink || mainStreamingLink == null
                      ? "ghost"
                      : "default"
                  }
                >
                  {mainStreamingLink ? (
                    <a
                      href={mainStreamingLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <PlayCircleIcon className="mr-2 h-4 w-4" /> Watch Now
                    </a>
                  ) : (
                    <p>No Link Found</p>
                  )}
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
                {loggedIn && !liked ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-[#d67900] hover:bg-[#d67900]"
                        disabled={liked}
                      >
                        Add to My List
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1f232d] border-0 text-white">
                      <DialogHeader>
                        <DialogTitle className="line-clamp-2">
                          {title}
                        </DialogTitle>
                        <DialogDescription>
                          Do you want to add this anime to your list?
                        </DialogDescription>
                      </DialogHeader>
                      <Tabs defaultValue="watching">
                        <TabsList className="flex gap-2 w-min">
                          <TabsTrigger value="watching">Watching</TabsTrigger>
                          <TabsTrigger value="finished">Finished</TabsTrigger>
                        </TabsList>
                        <TabsContent value="watching" className="w-full mt-2">
                          <form
                            className="flex justify-between items-center w-full"
                            action={testWithIDWatching}
                          >
                            {anime.episodes && anime.episodes > 1 && (
                              <div className="flex flex-col w-[60%] gap-2">
                                <Label htmlFor="episodeNumber">Episode</Label>
                                <Input
                                  name="episodeNumber"
                                  type="number"
                                  min={1}
                                  max={anime.episodes || 12}
                                  className="text-black"
                                  defaultValue={1}
                                />
                              </div>
                            )}
                            <div className="flex justify-end space-x-2 mt-4">
                              <Button
                                className="bg-blue-600 hover:bg-blue-600"
                                type="submit"
                              >
                                Add to Watching
                              </Button>
                            </div>
                          </form>
                        </TabsContent>
                        <TabsContent value="finished" className="w-full mt-2">
                          <form className="" action={testWithIDFinished}>
                            <Button
                              className="bg-green-600 hover:bg-green-600"
                              type="submit"
                            >
                              Finished
                            </Button>
                          </form>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                ) : loggedIn && liked ? (
                  <form action={removeWithId}>
                    <Button className="w-full bg-red-600 hover:bg-red-600">
                      Remove from My List
                    </Button>
                  </form>
                ) : (
                  <></>
                )}
              </div>
            </CardContent>
          </Card>
          {anime.trailer &&
            anime.trailer.site === "youtube" &&
            anime.trailer?.id && (
              <Card className="bg-[#1f232d] text-[#7c8793] border-0">
                <CardHeader>
                  <CardTitle className="text-white">Trailer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video">
                    <iframe
                      src={
                        anime.trailer?.site === "youtube"
                          ? "https://www.youtube.com/embed/" + anime.trailer.id
                          : ""
                      }
                      allowFullScreen
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

          {anime.externalLinks.length > 0 && (
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
                    {anime.externalLinks.map((link, index) => (
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
          )}
        </div>
        <div className="sm:col-span-2 flex flex-col gap-8">
          <Tabs defaultValue="overview">
            <TabsList
              className={cn(
                `w-full bg-[#1f232d] text-[#7c8793] border-0 flex flex-col h-auto min-[380px]:mb-0 min-[380px]:grid`,
                selectedEpisode &&
                  anime.status &&
                  anime.status !== "NOT_YET_RELEASED"
                  ? "min-[380px]:grid-cols-4"
                  : "min-[380px]:grid-cols-3"
              )}
            >
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {selectedEpisode &&
                anime.status &&
                anime.status !== "NOT_YET_RELEASED" && (
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
                      <div
                        className="mb-4"
                        dangerouslySetInnerHTML={{
                          __html: anime.description || "",
                        }}
                      />
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
                                href={`/search?genres=${genre}`}
                              >
                                <Badge variant="secondary">{genre}</Badge>
                              </Link>
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
                        <img
                          src={selectedEpisode.thumbnail}
                          alt={selectedEpisode.title}
                          className="rounded-lg bg-[#191d26]"
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
                        {anime.streamingEpisodes.map((episode, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center p-2 rounded-lg hover:bg-accent cursor-pointer"
                            onClick={() => setSelectedEpisode(episode)}
                          >
                            <img
                              src={episode.thumbnail}
                              alt={episode.title}
                              width={160}
                              height={90}
                              className="rounded bg-[#191d26]"
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
                    {anime.characterPreview?.edges.map((character) => (
                      <div
                        key={character.id}
                        className="flex flex-col items-center"
                      >
                        <img
                          src={character.node.image.large}
                          alt={character.node.name.userPreferred}
                          width={150}
                          height={200}
                          className="rounded-lg bg-[#191d26]"
                        />
                        <h3 className="mt-2 font-semibold text-center">
                          {character.node.name.userPreferred}
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
                    {anime.staffPreview?.edges.map((person) => (
                      <div
                        key={person.id}
                        className="flex flex-col items-center"
                      >
                        <img
                          src={person.node.image.large}
                          alt={person.node.name.userPreferred}
                          width={150}
                          height={200}
                          className="rounded-lg bg-[#191d26]"
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 justify-evenly gap-4 w-full">
                    {anime.relations &&
                      anime.relations.edges
                        .filter(
                          (rel) =>
                            (rel.node.format === "TV" ||
                              rel.node.format === "ONA") &&
                            rel.relationType !== "CHARACTER"
                        )
                        .map((rec) => (
                          <Link
                            href={"/anime/" + rec.node.id}
                            key={rec.id}
                            className="flex flex-col items-center"
                          >
                            <img
                              src={rec.node.coverImage.large}
                              alt={
                                rec.node.title.english ?? rec.node.title.romaji
                              }
                              width={150}
                              height={200}
                              className="rounded-md bg-[#191d26]"
                            />
                            <p className="text-sm text-center mt-2">
                              {(languageContext.language ===
                              LanguageType.English
                                ? rec.node.title.english
                                : languageContext.language ===
                                  LanguageType.Romanji
                                ? rec.node.title.romaji
                                : rec.node.title.native) ??
                                rec.node.title.romaji}
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 justify-evenly gap-4 w-full">
                    {anime.recommendations &&
                      anime.recommendations.nodes
                        .filter(
                          (rec) =>
                            (rec.mediaRecommendation.format === "TV" ||
                              rec.mediaRecommendation.format === "ONA") &&
                            rec.mediaRecommendation.type === "ANIME"
                        )
                        .map((rec) => (
                          <Link
                            href={"/anime/" + rec.mediaRecommendation.id}
                            key={rec.id}
                            className="flex flex-col items-center"
                          >
                            <img
                              src={rec.mediaRecommendation.coverImage.large}
                              alt={
                                rec.mediaRecommendation.title.english ??
                                rec.mediaRecommendation.title.romaji
                              }
                              width={150}
                              height={200}
                              className="rounded-md bg-[#191d26]"
                            />
                            <p className="text-sm text-center mt-2">
                              {(languageContext.language ===
                              LanguageType.English
                                ? rec.mediaRecommendation.title.english
                                : languageContext.language ===
                                  LanguageType.Romanji
                                ? rec.mediaRecommendation.title.romaji
                                : rec.mediaRecommendation.title.native) ??
                                rec.mediaRecommendation.title.romaji}
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
