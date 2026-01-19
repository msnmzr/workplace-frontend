"use client";

import { useEffect, useState, useCallback } from "react";
import { NewsItem, NewsService } from "@/services/news.service";
import { getAssetUrl } from "@/lib/utils";
import Link from "next/link";

export function NewsCarousel() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNews = useCallback(async () => {
        try {
            const data = await NewsService.getNews();
            // Take top 5 latest published news
            const latestNews = data
                .filter((item: NewsItem) => item.is_published)
                .slice(0, 5);
            setNews(latestNews);
        } catch (error) {
            console.error("Failed to fetch news for carousel:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    useEffect(() => {
        if (news.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [news]);

    if (isLoading) {
        return (
            <div className="relative h-[250px] w-full overflow-hidden rounded-[10px] bg-gray-200 dark:bg-dark-3 animate-pulse">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 mb-2 rounded"></div>
                    <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (news.length === 0) return null;

    return (
        <div className="relative h-[300px] w-full overflow-hidden rounded-[10px] shadow-card group">
            {news.map((item, index) => (
                <div
                    key={item.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <img
                        src={getAssetUrl(item.image)}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/images/placeholder.png";
                        }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 transform transition-transform duration-500 delay-100 translate-y-0 translate-x-0">
                        <Link href={`/news/${item.id}`} className="block">
                            <span className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-dark">
                                Latest News
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-white hover:text-primary transition-colors duration-300 line-clamp-2">
                                {item.title}
                            </h2>
                        </Link>
                    </div>
                </div>
            ))}

            {/* Indicators */}
            <div className="absolute bottom-4 right-6 z-20 flex gap-2">
                {news.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-1.5 transition-all duration-300 rounded-full ${index === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/50 hover:bg-white"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Navigation Buttons (Visible on hover) */}
            <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + news.length) % news.length)}
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white opacity-0 transition-opacity duration-300 hover:bg-black/50 group-hover:opacity-100"
                aria-label="Previous slide"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % news.length)}
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white opacity-0 transition-opacity duration-300 hover:bg-black/50 group-hover:opacity-100"
                aria-label="Next slide"
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
