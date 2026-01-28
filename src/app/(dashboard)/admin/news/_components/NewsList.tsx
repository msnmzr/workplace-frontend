"use client";

import { useEffect, useState } from "react";
import { NewsItem, NewsService } from "@/services/news.service";
import { getAssetUrl } from "@/lib/utils";
import ActionDropdown from "@/components/Dropdowns/ActionDropdown";
import DataTableControls from "@/components/Tables/DataTableControls";
import DataTableInfo from "@/components/Tables/DataTableInfo";
import Pagination from "@/components/Pagination/Pagination";
import NewsForm from "./NewsForm";
import Loader from "@/components/common/Loader";

export default function NewsList() {
    const [news, setNews] = useState<NewsItem[]>([]);
    // Loading state for news fetching
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

    useEffect(() => {
        fetchNews();
    }, [search, perPage, currentPage]);

    const fetchNews = async () => {
        setIsLoading(true);
        try {
            const allNews = await NewsService.getNews();

            // Client-side filtering and pagination
            let filtered = allNews;
            if (search) {
                const lowerSearch = search.toLowerCase();
                filtered = allNews.filter(
                    (item: NewsItem) =>
                        item.title.toLowerCase().includes(lowerSearch) ||
                        item.description?.toLowerCase().includes(lowerSearch)
                );
            }

            setTotalEntries(filtered.length);
            const start = (currentPage - 1) * perPage;
            const paginated = filtered.slice(start, start + perPage);
            setNews(paginated);
        } catch (error) {
            console.error("Failed to fetch news", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (term: string) => {
        setSearch(term);
        setCurrentPage(1);
    };

    const handlePerPageChange = (amount: number) => {
        setPerPage(amount);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(totalEntries / perPage);

    const openCreateModal = () => {
        setSelectedNews(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: NewsItem) => {
        setSelectedNews(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this news item?")) {
            try {
                await NewsService.deleteNews(id);
                fetchNews();
            } catch (error) {
                console.error("Failed to delete news", error);
            }
        }
    };

    const handleToggleFeatured = async (id: number) => {
        try {
            await NewsService.toggleFeatured(id);
            fetchNews();
        } catch (error) {
            console.error("Failed to toggle featured status", error);
        }
    };

    const handleTogglePublished = async (id: number) => {
        try {
            await NewsService.togglePublished(id);
            fetchNews();
        } catch (error) {
            console.error("Failed to toggle published status", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedNews(null);
    };

    const handleSuccess = () => {
        closeModal();
        fetchNews();
    };

    return (
        <div className="rounded-[10px] border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:px-7.5">
            <div className="mb-6 flex items-center justify-between">
                <h4 className="text-xl font-bold text-dark dark:text-primary">
                    News List
                </h4>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-dark hover:bg-opacity-90 lg:px-6"
                >
                    Add News
                </button>
            </div>

            <DataTableControls
                onSearch={handleSearch}
                searchValue={search}
                onPerPageChange={handlePerPageChange}
                perPage={perPage}
            />

            <div className="max-w-full overflow-x-auto">
                <div className="grid grid-cols-6 rounded-t-sm bg-primary text-dark sm:grid-cols-7">
                    <div className="p-2.5">
                        <h5 className="font-medium leading-none xsm:text-base">Image</h5>
                    </div>
                    <div className="p-2.5 col-span-2">
                        <h5 className="text-sm font-medium leading-none xsm:text-base">Title</h5>
                    </div>
                    <div className="p-2.5 text-center">
                        <h5 className="text-sm font-medium leading-none xsm:text-base">Category</h5>
                    </div>
                    <div className="p-2.5 text-center">
                        <h5 className="text-sm font-medium leading-none xsm:text-base">Featured</h5>
                    </div>
                    <div className="p-2.5 text-center">
                        <h5 className="text-sm font-medium leading-none xsm:text-base">Published</h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block">
                        <h5 className="text-sm font-medium leading-none xsm:text-base">Actions</h5>
                    </div>
                </div>

                {isLoading ? (
                    <Loader />
                ) : (
                    news.map((item) => (
                        <div
                            className={`grid grid-cols-6 sm:grid-cols-7 ${news.indexOf(item) === news.length - 1
                                ? ""
                                : "border-b border-stroke dark:border-dark-3"
                                }`}
                            key={item.id}
                        >
                            <div className="p-2.5">
                                <div className="h-12.5 w-12.5 rounded-md overflow-hidden bg-gray-2 shadow-inner dark:bg-dark-3">
                                    <img
                                        src={getAssetUrl(item.image)}
                                        alt={item.title}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/images/placeholder.png"; // Fallback
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center p-2.5 col-span-2">
                                <p className="text-dark leading-tight dark:text-primary font-medium truncate">
                                    {item.title}
                                </p>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <p className="text-sm text-black dark:text-white">
                                    {item.category?.name || "N/A"}
                                </p>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <button
                                    onClick={() => handleToggleFeatured(item.id)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${item.is_featured ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.is_featured ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <button
                                    onClick={() => handleTogglePublished(item.id)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${item.is_published ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.is_published ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>

                            <div className="hidden items-center justify-center p-2.5 sm:flex">
                                <ActionDropdown
                                    actions={[
                                        {
                                            label: "Edit",
                                            onClick: () => openEditModal(item),
                                        },
                                        {
                                            label: "Delete",
                                            onClick: () => handleDelete(item.id),
                                            variant: "danger",
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    ))
                )}

                {news.length === 0 && !isLoading && (
                    <div className="p-4 text-center text-gray-500">No news found.</div>
                )}
            </div>

            <div className="dark:border-strokedark mt-4 flex items-center justify-between border-t border-stroke">
                <DataTableInfo
                    totalEntries={totalEntries}
                    currentPage={currentPage}
                    perPage={perPage}
                />

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <NewsForm
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSuccess={handleSuccess}
                    newsItem={selectedNews}
                />
            )}
        </div>
    );
}
