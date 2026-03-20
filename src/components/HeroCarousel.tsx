"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { MediaDisplay } from "@/utils/anilistTypes";
import { formatTimeUntilAiring } from "@/utils/date";

interface HeroCarouselProps {
  trendingAnime: MediaDisplay[];
}

const HeroCarousel = ({ trendingAnime }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slides = trendingAnime.slice(0, 5).filter((anime) => anime.bannerImage);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, slides.length]);

  if (slides.length === 0) return null;

  const currentAnime = slides[currentIndex];
  const title = currentAnime.title.english ?? currentAnime.title.romaji ?? currentAnime.title.native;

  const score = currentAnime.averageScore
    ? (currentAnime.averageScore / 10).toFixed(1)
    : null;

  const nextEpisodeInfo = currentAnime.nextAiringEpisode
    ? `Ep ${currentAnime.nextAiringEpisode.episode} — ${formatTimeUntilAiring(
        currentAnime.nextAiringEpisode.airingAt
      )}`
    : null;

  return (
    <div
      className="relative w-[calc(100%+2.5rem)] -mx-5 -mt-6 lg:w-[calc(100%+5rem)] lg:-mx-10 xl:w-[calc(100%+8.5rem)] xl:-mx-17 2xl:w-[calc(100%+12rem)] 2xl:-mx-24 min-[1750px]:mx-0 min-[1750px]:w-full min-[1750px]:rounded-2xl h-[340px] sm:h-[420px] md:h-[500px] lg:h-[560px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-top transition-opacity duration-700"
        style={{ backgroundImage: `url(${currentAnime.bannerImage})` }}
      />

      {/* Gradient overlay — dark at bottom for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, #101418 0%, rgba(16,20,24,0.55) 45%, rgba(16,20,24,0.1) 100%)",
        }}
      />
      {/* Side gradient for text area */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

      {/* Content — aligned to the same padding as the rest of the page */}
      <div className="relative h-full flex flex-col justify-end px-5 lg:px-10 xl:px-17 2xl:px-24 pb-16 md:pb-20">
        <div className="max-w-2xl">
          {/* Format Badge */}
          <span className="inline-block px-3 py-1 text-xs font-bold bg-primary-container text-white rounded mb-4 uppercase tracking-widest">
            {currentAnime.format}
          </span>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-4 leading-[0.95]">
            {title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-white/80 text-sm mb-6">
            {score && (
              <div className="flex items-center gap-1">
                <Star size={15} className="text-primary fill-primary" />
                <span className="font-bold">{score}</span>
              </div>
            )}
            {currentAnime.episodes && (
              <span>{currentAnime.episodes} Episodes</span>
            )}
            {nextEpisodeInfo && (
              <span className="text-primary font-medium">{nextEpisodeInfo}</span>
            )}
          </div>

          {/* CTA */}
          <Link
            href={`/anime/${currentAnime.id}`}
            className="inline-block px-8 py-3 bg-primary text-on-primary font-bold rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-xl uppercase tracking-wide text-sm"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Bottom bar: prev arrow + dots + next arrow */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button
            onClick={prevSlide}
            className="p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary w-6"
                    : "w-2 bg-transparent border-2 border-white/80 hover:border-white"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
