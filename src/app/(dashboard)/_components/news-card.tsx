"use client";

import { useEffect, useState } from "react";
import { NewsItem, NewsService } from "@/services/news.service";
import { InfoWidget } from "./info-widget";
import { formatDate } from "@/lib/utils";

export function NewsCard() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Fetch all news and then filter/slice for the widget
                const data = await NewsService.getNews();
                // Filter only published news and take top 3
                const latestNews = data
                    .filter((item: NewsItem) => item.is_published)
                    .slice(0, 3);
                setNews(latestNews);
            } catch (error) {
                console.error("Failed to fetch news for widget:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (isLoading) {
        return (
            <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark p-4 sm:p-6 animate-pulse">
                <div className="h-7 w-32 bg-gray-200 dark:bg-dark-3 mb-6 rounded"></div>
                <div className="flex flex-col gap-5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col gap-1">
                            <div className="h-5 bg-gray-200 dark:bg-dark-3 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 dark:bg-dark-3 rounded w-24 mt-1"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <InfoWidget
            title="Latest News"
            items={news.map((item) => ({
                title: item.title,
                date: item.created_at ? formatDate(item.created_at) : "N/A",
                link: `/news/${item.id}`,
            }))}
        />
    );
}
