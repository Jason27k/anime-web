"use client";
import { useState } from "react";
import { Star, Plus, ExternalLinkIcon, ChevronDown, ChevronUp, Play, Users } from "lucide-react";
import { Media } from "@/utils/anilistTypes";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import AnimeSheet from "./AnimeSheet";
import { AnimeStatus } from "@/lib/api-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface AnimeDetailProps {
  anime: Media;
  loggedIn: boolean;
  liked: boolean;
  listEntry?: { status: AnimeStatus; episode: number | null } | null;
}

const seasonLabels: Record<string, string> = {
  WINTER: "Winter",
  SPRING: "Spring",
  SUMMER: "Summer",
  FALL: "Fall",
};

const statusConfig: Record<string, { label: string; dot: string }> = {
  RELEASING: { label: "Currently Airing", dot: "bg-green-500 animate-pulse" },
  FINISHED: { label: "Finished", dot: "bg-muted-foreground" },
  NOT_YET_RELEASED: { label: "Not Yet Released", dot: "bg-blue-500" },
  CANCELLED: { label: "Cancelled", dot: "bg-red-500" },
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
      <span className="w-8 h-1 bg-primary rounded-full shrink-0" />
      {children}
    </h2>
  );
}

export default function AnimeDetails({
  anime,
  loggedIn,
  liked,
  listEntry,
}: AnimeDetailProps) {
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [linkCollapsed, setLinkCollapsed] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(anime.streamingEpisodes[0]);

  const title = anime.title.english ?? anime.title.romaji ?? anime.title.native;

  const heroImage = anime.bannerImage || anime.coverImage.extraLarge;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null;
  const mainStudio = anime.studios.edges.find((e) => e.isMain)?.node.name;
  const streamingLinks = anime.externalLinks.filter((l) => l.type === "STREAMING");
  const mainStreamingLink =
    streamingLinks.find(
      (l) => l.site === "Crunchyroll" || l.site === "Netflix" || l.site === "HIDIVE"
    ) ?? streamingLinks[0];
  const officialSiteLink = anime.externalLinks.find((l) => l.type === "INFO");

  const seasonLabel = anime.season ? seasonLabels[anime.season] : null;
  const statusInfo = statusConfig[anime.status] ?? { label: anime.status, dot: "bg-muted-foreground" };

  const popularityLabel =
    anime.popularity > 1_000_000
      ? (Math.floor(anime.popularity / 100_000) / 10).toFixed(1) + "M"
      : Math.floor(anime.popularity / 1_000) + "K";

  const recommendations = (anime.recommendations?.nodes ?? []).filter(
    (rec) =>
      (rec.mediaRecommendation.format === "TV" || rec.mediaRecommendation.format === "ONA") &&
      rec.mediaRecommendation.type === "ANIME"
  );

  const relatedAnime = (anime.relations?.edges ?? []).filter(
    (rel) =>
      (rel.node.format === "TV" || rel.node.format === "ONA") &&
      rel.relationType !== "CHARACTER"
  );

  const hasEpisodes =
    !!selectedEpisode && !!anime.status && anime.status !== "NOT_YET_RELEASED";

  return (
    <div>
      {/* ── Cinematic Hero ── */}
      <section className="relative w-[calc(100%+2.5rem)] -mx-5 -mt-6 lg:w-[calc(100%+5rem)] lg:-mx-10 xl:w-[calc(100%+8.5rem)] xl:-mx-17 2xl:w-[calc(100%+12rem)] 2xl:-mx-24 min-[1750px]:mx-0 min-[1750px]:w-full h-[480px] md:h-[580px] overflow-hidden flex items-end pb-16 px-5 lg:px-10 xl:px-17 2xl:px-24">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10" />
          <img
            src={heroImage}
            alt={title}
            className="w-full h-full object-cover object-top scale-105"
          />
        </div>

        {/* Hero text */}
        <div className="relative z-20 max-w-4xl">
          <div className="flex items-center gap-4 mb-4">
            {seasonLabel && anime.seasonYear && (
              <span className="bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                {seasonLabel} {anime.seasonYear}
              </span>
            )}
            {score && (
              <div className="flex items-center gap-1 text-primary">
                <Star size={16} fill="currentColor" />
                <span className="font-bold text-lg">{score}</span>
              </div>
            )}
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase mb-4 leading-[0.9] line-clamp-3">
            {title}
          </h1>

          <div className="flex flex-wrap gap-3 mt-6">
            {mainStreamingLink ? (
              <a
                href={mainStreamingLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary/70 text-background font-bold px-6 py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all"
              >
                <Play size={18} fill="currentColor" /> Watch Now
              </a>
            ) : null}
            {loggedIn && (
              <button
                onClick={() => setAddSheetOpen(true)}
                className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-outline-variant/30 text-foreground font-bold px-6 py-3 rounded-lg hover:bg-white/10 active:scale-95 transition-all"
              >
                <Plus size={18} />
                {liked ? "Edit My List" : "Add to Watchlist"}
              </button>
            )}
            {officialSiteLink && (
              <a
                href={officialSiteLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-outline-variant/30 text-foreground font-bold px-6 py-3 rounded-lg hover:bg-white/10 active:scale-95 transition-all"
              >
                <ExternalLinkIcon size={16} /> Official Site
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Content Grid ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-24 -mt-8 relative z-10">

        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="sticky top-20 space-y-6">

            {/* Portrait */}
            <div className="hidden lg:block aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-outline-variant/10 group">
              <img
                src={anime.coverImage.extraLarge}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Stats */}
            <div className="bg-surface-container-low p-6 rounded-xl space-y-5">
              {mainStudio && (
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-primary tracking-[0.15em] uppercase">Studio</span>
                  <span className="text-foreground font-medium">{mainStudio}</span>
                </div>
              )}
              {anime.episodes && (
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-primary tracking-[0.15em] uppercase">Episodes</span>
                  <span className="text-foreground font-medium">
                    {anime.episodes}{anime.status === "RELEASING" ? " (Ongoing)" : ""}
                  </span>
                </div>
              )}
              {anime.duration && (
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-primary tracking-[0.15em] uppercase">Duration</span>
                  <span className="text-foreground font-medium">{anime.duration} min per ep</span>
                </div>
              )}
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-primary tracking-[0.15em] uppercase">Status</span>
                <span className="text-foreground font-medium flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${statusInfo.dot}`} />
                  {statusInfo.label}
                </span>
              </div>
              {score && (
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-primary tracking-[0.15em] uppercase">Score</span>
                  <span className="text-foreground font-medium flex items-center gap-1">
                    <Star size={14} className="text-primary" fill="currentColor" />
                    {score}
                  </span>
                </div>
              )}
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-primary tracking-[0.15em] uppercase">Popularity</span>
                <span className="text-foreground font-medium flex items-center gap-1">
                  <Users size={14} className="text-primary" />
                  {popularityLabel}
                </span>
              </div>
              {anime.format && (
                <div className="space-y-1">
                  <span className="block text-[10px] font-bold text-primary tracking-[0.15em] uppercase">Format</span>
                  <span className="text-foreground font-medium">{anime.format}</span>
                </div>
              )}
              {anime.genres.length > 0 && (
                <div className="space-y-2">
                  <span className="block text-[10px] font-bold text-primary tracking-[0.15em] uppercase">Genres</span>
                  <div className="flex flex-wrap gap-1.5">
                    {anime.genres.map((genre) => (
                      <Link
                        key={genre}
                        href={`/search?genres=${genre}`}
                        className="text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-muted-foreground hover:text-primary transition-colors"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Trailer */}
            {anime.trailer?.site === "youtube" && anime.trailer?.id && (
              <div className="rounded-xl overflow-hidden">
                <p className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase mb-3">Trailer</p>
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {/* External Links */}
            {anime.externalLinks.length > 0 && (
              <Collapsible open={linkCollapsed} onOpenChange={setLinkCollapsed}>
                <CollapsibleTrigger className="w-full flex items-center justify-between py-2">
                  <span className="text-[10px] font-bold text-primary tracking-[0.15em] uppercase">Links</span>
                  {linkCollapsed ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2">
                  {anime.externalLinks.map((link) => (
                    <Button key={link.id} className="w-full" variant="outline" asChild size="sm">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLinkIcon size={14} className="mr-2" /> {link.site}
                      </a>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </aside>

        {/* Main Column */}
        <div className="lg:col-span-9 space-y-16">

          {/* Synopsis */}
          <section>
            <SectionHeading>Synopsis</SectionHeading>
            <div className="bg-surface-container-low p-8 rounded-2xl">
              <div
                className="text-lg text-muted-foreground leading-[1.8] prose-invert [&>p:first-child::first-letter]:text-5xl [&>p:first-child::first-letter]:font-black [&>p:first-child::first-letter]:mr-3 [&>p:first-child::first-letter]:float-left [&>p:first-child::first-letter]:text-primary"
                dangerouslySetInnerHTML={{ __html: anime.description || "No synopsis available." }}
              />
            </div>
          </section>

          {/* Episodes */}
          {hasEpisodes && (
            <section>
              <SectionHeading>Episodes</SectionHeading>
              <div className="bg-surface-container-low rounded-2xl overflow-hidden">
                {/* Selected episode preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 border-b border-outline-variant/10">
                  <div className="aspect-video relative rounded-xl overflow-hidden">
                    <img
                      src={selectedEpisode.thumbnail}
                      alt={selectedEpisode.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <a
                        href={selectedEpisode.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-primary text-background font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all"
                      >
                        <Play size={16} fill="currentColor" /> Watch
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-xl font-bold mb-2 text-foreground">{selectedEpisode.title}</h3>
                    <p className="text-muted-foreground text-sm">on {selectedEpisode.site}</p>
                  </div>
                </div>
                {/* Episode grid */}
                <ScrollArea className="h-[320px] p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {anime.streamingEpisodes.map((ep, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedEpisode(ep)}
                        className={`flex flex-col rounded-lg overflow-hidden hover:ring-2 ring-primary/50 transition-all text-left ${selectedEpisode === ep ? "ring-2 ring-primary" : ""}`}
                      >
                        <img src={ep.thumbnail} alt={ep.title} className="w-full aspect-video object-cover" />
                        <p className="text-xs p-2 text-muted-foreground line-clamp-2">{ep.title}</p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </section>
          )}

          {/* Characters & Cast */}
          {(anime.characterPreview?.edges?.length ?? 0) > 0 && (
            <section>
              <SectionHeading>Characters &amp; Cast</SectionHeading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {anime.characterPreview!.edges.map((char) => {
                  const jaVA = char.voiceActors.find((va) => va.language === "Japanese") ?? char.voiceActors[0];
                  return (
                    <div
                      key={char.id}
                      className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl hover:bg-surface-container-high transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={char.node.image.large}
                          alt={char.node.name.userPreferred}
                          className="w-14 h-14 rounded-full object-cover grayscale hover:grayscale-0 transition-all shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-foreground truncate">{char.node.name.userPreferred}</h4>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider">{char.role}</span>
                        </div>
                      </div>
                      {jaVA && (
                        <div className="text-right shrink-0 ml-4">
                          <h4 className="font-medium text-primary text-sm">{jaVA.name.userPreferred}</h4>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {jaVA.language} VA
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Production Staff */}
          {(anime.staffPreview?.edges?.length ?? 0) > 0 && (
            <section>
              <SectionHeading>Production Staff</SectionHeading>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {anime.staffPreview!.edges.map((person) => (
                  <div
                    key={person.id}
                    className="bg-surface-container-low p-5 rounded-xl text-center hover:bg-surface-container-high transition-colors border border-outline-variant/5"
                  >
                    <img
                      src={person.node.image.large}
                      alt={person.node.name.userPreferred}
                      className="w-16 h-16 rounded-full object-cover mx-auto mb-3 grayscale hover:grayscale-0 transition-all"
                    />
                    <span className="block text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{person.role}</span>
                    <p className="font-bold text-foreground text-sm">{person.node.name.userPreferred}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>

      {/* ── Recommendations ── */}
      {recommendations.length > 0 && (
        <section className="w-[calc(100%+2.5rem)] -mx-5 lg:w-[calc(100%+5rem)] lg:-mx-10 xl:w-[calc(100%+8.5rem)] xl:-mx-17 2xl:w-[calc(100%+12rem)] 2xl:-mx-24 min-[1750px]:mx-0 min-[1750px]:w-full bg-surface-container-low/50 py-20 px-5 lg:px-10 xl:px-17 2xl:px-24">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm block mb-2">Discovery</span>
                <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground">Recommended For You</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {recommendations.slice(0, 6).map((rec) => {
                const recTitle =
                  rec.mediaRecommendation.title.english ??
                  rec.mediaRecommendation.title.romaji ??
                  rec.mediaRecommendation.title.native;
                return (
                  <Link
                    key={rec.id}
                    href={`/anime/${rec.mediaRecommendation.id}`}
                    className="group"
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden mb-3 relative">
                      <img
                        src={rec.mediaRecommendation.coverImage.large}
                        alt={recTitle}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="bg-primary text-background text-[10px] font-black px-2 py-0.5 rounded">
                          {rec.mediaRecommendation.format}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground truncate text-sm group-hover:text-primary transition-colors">
                      {recTitle}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Related Anime ── */}
      {relatedAnime.length > 0 && (
        <section className="w-[calc(100%+2.5rem)] -mx-5 lg:w-[calc(100%+5rem)] lg:-mx-10 xl:w-[calc(100%+8.5rem)] xl:-mx-17 2xl:w-[calc(100%+12rem)] 2xl:-mx-24 min-[1750px]:mx-0 min-[1750px]:w-full py-20 px-5 lg:px-10 xl:px-17 2xl:px-24">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm block mb-2">Series</span>
                <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground">Related Anime</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {relatedAnime.slice(0, 6).map((rel) => {
                const relTitle =
                  rel.node.title.english ??
                  rel.node.title.romaji ??
                  rel.node.title.native;
                return (
                  <Link
                    key={rel.id}
                    href={`/anime/${rel.node.id}`}
                    className="group"
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden mb-3 relative">
                      <img
                        src={rel.node.coverImage.large}
                        alt={relTitle}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="bg-primary text-background text-[10px] font-black px-2 py-0.5 rounded">
                          {rel.node.format}
                        </span>
                        </div>
                    </div>
                    <h3 className="font-bold text-foreground truncate text-sm group-hover:text-primary transition-colors">
                      {relTitle}
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                      {rel.relationType.replace(/_/g, " ")}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* AnimeSheet */}
      {loggedIn && (
        <AnimeSheet
          open={addSheetOpen}
          onOpenChange={setAddSheetOpen}
          animeId={anime.id}
          animeTitle={title}
          totalEpisodes={anime.episodes ?? null}
          coverImage={anime.coverImage.extraLarge}
          isInList={liked}
          currentStatus={listEntry?.status}
          currentEpisode={listEntry?.episode}
          isAnimeFinishedAiring={!anime.nextAiringEpisode}
        />
      )}
    </div>
  );
}
