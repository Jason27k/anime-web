"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { MediaDisplay } from "@/utils/anilistTypes";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { formatTimeUntilAiring } from "@/utils/date";

interface HeroCarouselProps {
  trendingAnime: MediaDisplay[];
}

const HeroCarousel = ({ trendingAnime }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const languageContext = useContext(LanguageContext);

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
  const title =
    (languageContext.language === LanguageType.English
      ? currentAnime.title.english
      : languageContext.language === LanguageType.Romanji
      ? currentAnime.title.romaji
      : currentAnime.title.native) ?? currentAnime.title.romaji;

  const score = currentAnime.averageScore
    ? (currentAnime.averageScore / 10).toFixed(1)
    : null;

  const nextEpisodeInfo = currentAnime.nextAiringEpisode
    ? `Ep ${currentAnime.nextAiringEpisode.episode} - ${formatTimeUntilAiring(
        currentAnime.nextAiringEpisode.airingAt
      )}`
    : null;

  return (
    <div
      className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] overflow-hidden rounded-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{ backgroundImage: `url(${currentAnime.bannerImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-10">
        <div className="max-w-2xl">
          {/* Format Badge */}
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-orange-500 text-white rounded mb-3">
            {currentAnime.format}
          </span>

          {/* Title */}
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 line-clamp-2">
            {title}
          </h2>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-white/80 text-sm mb-4">
            {score && (
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span>{score}</span>
              </div>
            )}
            {currentAnime.episodes && <span>{currentAnime.episodes} Episodes</span>}
            {nextEpisodeInfo && (
              <span className="text-orange-400">{nextEpisodeInfo}</span>
            )}
          </div>

          {/* CTA Button */}
          <Link
            href={`/anime/${currentAnime.id}`}
            className="inline-block px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-orange-500"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
