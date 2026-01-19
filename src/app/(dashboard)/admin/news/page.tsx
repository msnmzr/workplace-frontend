"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ActionDropdown from "@/components/Dropdowns/ActionDropdown";
import Pagination from "@/components/Pagination/Pagination";
import DataTableControls from "@/components/Tables/DataTableControls";
import DataTableInfo from "@/components/Tables/DataTableInfo";
import { NewsItem, NewsService } from "@/services/news.service";
import { useEffect, useState } from "react";
import { getAssetUrl } from "@/lib/utils";

export default function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [formData, setFormData] = useState<Partial<NewsItem>>({
        title: "",
        description: "",
        image: "",
        image_file: null,
        is_featured: false,
        is_published: true,
    });

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

    // Modal Handlers
    const openCreateModal = () => {
        setIsEditing(false);
        setSelectedNews(null);
        setFormData({
            title: "",
            description: "",
            image: "",
            image_file: null,
            is_featured: false,
            is_published: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: NewsItem) => {
        setIsEditing(true);
        setSelectedNews(item);
        setFormData({
            title: item.title,
            description: item.description || "",
            image: item.image || "",
            image_file: null,
            is_featured: !!item.is_featured,
            is_published: !!item.is_published,
        });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("title", formData.title || "");
            data.append("description", formData.description || "");
            data.append("is_featured", formData.is_featured ? "1" : "0");
            data.append("is_published", formData.is_published ? "1" : "0");

            if (formData.image_file) {
                data.append("image", formData.image_file);
            }

            if (isEditing && selectedNews) {
                await NewsService.updateNews(selectedNews.id, data);
            } else {
                await NewsService.createNews(data);
            }
            setIsModalOpen(false);
            fetchNews();
        } catch (error) {
            console.error("Failed to save news", error);
        }
    };

    return (
        <>
            <Breadcrumb pageName="News Management" />

            <div className="flex flex-col gap-10 text-sm">
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
                        <div className="grid grid-cols-5 rounded-t-sm bg-primary text-dark sm:grid-cols-6">
                            <div className="p-2.5">
                                <h5 className="font-medium leading-none xsm:text-base">Image</h5>
                            </div>
                            <div className="p-2.5 col-span-2">
                                <h5 className="text-sm font-medium leading-none xsm:text-base">Title</h5>
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
                            <div className="p-4 text-center">Loading...</div>
                        ) : (
                            news.map((item) => (
                                <div
                                    className={`grid grid-cols-5 sm:grid-cols-6 ${news.indexOf(item) === news.length - 1
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
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-999999 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 outline-none focus:outline-none">
                    <div className="relative max-h-[90vh] w-full max-w-2xl p-4">
                        <div className="relative rounded-lg bg-white shadow dark:bg-gray-dark overflow-hidden flex flex-col max-h-full">
                            <div className="flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {isEditing ? "Edit News Item" : "Create News Item"}
                                </h3>
                                <button
                                    type="button"
                                    className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter news title"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-5 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Featured Image
                                        </label>
                                        <div className="flex items-center gap-4">
                                            {(formData.image || formData.image_file) && (
                                                <div className="h-20 w-20 overflow-hidden rounded border border-stroke dark:border-dark-3">
                                                    <img
                                                        src={formData.image_file ? URL.createObjectURL(formData.image_file) : getAssetUrl(formData.image)}
                                                        alt="Preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="w-full cursor-pointer rounded-lg border border-stroke bg-transparent py-2 pl-5 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    setFormData({ ...formData, image_file: file });
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Content
                                        </label>
                                        <textarea
                                            rows={6}
                                            placeholder="Enter news content"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-5 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            value={formData.description || ""}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="mb-4">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={formData.is_featured}
                                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                                />
                                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Featured</span>
                                            </label>
                                        </div>

                                        <div className="mb-4">
                                            <label className="flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={formData.is_published}
                                                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                                />
                                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Published</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-4 mt-6">
                                        <button
                                            type="button"
                                            className="bg-dark-2 rounded px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-primary rounded px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
                                        >
                                            {isEditing ? "Update" : "Create"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
