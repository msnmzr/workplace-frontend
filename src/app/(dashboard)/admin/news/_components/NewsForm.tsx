"use client";

import { useState, useEffect } from "react";
import { NewsItem, NewsService, NewsCategory, NewsPriority, NewsTag } from "@/services/news.service";
import { getAssetUrl } from "@/lib/utils";
import MultiSelect from "@/components/FormElements/MultiSelect";

interface NewsFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    newsItem?: NewsItem | null;
}

export default function NewsForm({ isOpen, onClose, onSuccess, newsItem }: NewsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<NewsCategory[]>([]);
    const [priorities, setPriorities] = useState<NewsPriority[]>([]);
    const [tags, setTags] = useState<NewsTag[]>([]);

    const [formData, setFormData] = useState<Partial<NewsItem>>({
        title: "",
        content: "",
        description: "",
        category_id: undefined,
        priority_id: undefined,
        tags_ids: [],
        image: "",
        image_file: null,
        attachment: "",
        attachment_file: null,
        is_featured: false,
        is_published: true,
        expires_at: "",
    });

    useEffect(() => {
        fetchMetadata();
    }, []);

    useEffect(() => {
        if (newsItem) {
            setFormData({
                ...newsItem,
                category_id: newsItem.category_id || newsItem.category?.id,
                priority_id: newsItem.priority_id || newsItem.priority?.id,
                tags_ids: newsItem.tags?.map(t => t.id) || [],
                image_file: null,
                attachment_file: null,
            });
        } else {
            setFormData({
                title: "",
                content: "",
                description: "",
                // Set defaults if available, otherwise undefined
                category_id: categories.length > 0 ? categories[0].id : undefined,
                priority_id: priorities.length > 0 ? priorities[0].id : undefined,
                tags_ids: [],
                image: "",
                image_file: null,
                attachment: "",
                attachment_file: null,
                is_featured: false,
                is_published: true,
                expires_at: "",
            });
        }
    }, [newsItem, categories, priorities]); // Added dependencies to reset defaults when loaded

    const fetchMetadata = async () => {
        try {
            const [cats, pris, tgs] = await Promise.all([
                NewsService.getCategories(),
                NewsService.getPriorities(),
                NewsService.getTags(),
            ]);
            setCategories(Array.isArray(cats) ? cats : []);
            setPriorities(Array.isArray(pris) ? pris : []);
            setTags(Array.isArray(tgs) ? tgs : []);
        } catch (error) {
            console.error("Failed to fetch metadata", error);
        }
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = new FormData();
            data.append("title", formData.title || "");
            data.append("content", formData.content || ""); // Assuming content is used for full text
            data.append("description", formData.description || ""); // Assuming description is summary
            data.append("category_id", String(formData.category_id || ""));
            data.append("priority_id", String(formData.priority_id || ""));
            data.append("is_featured", formData.is_featured ? "1" : "0");
            data.append("is_published", formData.is_published ? "1" : "0");

            if (formData.expires_at) {
                data.append("expires_at", formData.expires_at);
            }

            if (formData.tags_ids && formData.tags_ids.length > 0) {
                formData.tags_ids.forEach(id => data.append("tags[]", String(id)));
            }

            if (formData.image_file) {
                data.append("image", formData.image_file);
            }

            if (formData.attachment_file) {
                data.append("attachment", formData.attachment_file);
            }

            if (newsItem?.id) {
                await NewsService.updateNews(newsItem.id, data);
            } else {
                await NewsService.createNews(data);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save news", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-999999 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 outline-none focus:outline-none">
            <div className="relative max-h-[90vh] w-full max-w-4xl p-4">
                <div className="relative rounded-lg bg-white shadow dark:bg-gray-dark overflow-hidden flex flex-col max-h-full">
                    <div className="flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {newsItem ? "Edit News Item" : "Create News Item"}
                        </h3>
                        <button
                            type="button"
                            className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={onClose}
                        >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div>
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
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            required
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-5 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            value={formData.category_id}
                                            onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Priority <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            required
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-5 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            value={formData.priority_id}
                                            onChange={(e) => setFormData({ ...formData, priority_id: parseInt(e.target.value) })}
                                        >
                                            <option value="">Select Priority</option>
                                            {priorities.map(pri => (
                                                <option key={pri.id} value={pri.id}>{pri.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Short Description
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder="Enter short description"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-5 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            value={formData.description || ""}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Full Content
                                        </label>
                                        <textarea
                                            rows={6}
                                            placeholder="Enter full content"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-5 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            value={formData.content || ""}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div>
                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Featured Image
                                        </label>
                                        <div className="flex flex-col gap-4">
                                            {(formData.image || formData.image_file) && (
                                                <div className="h-30 w-full overflow-hidden rounded border border-stroke dark:border-dark-3">
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
                                            Attachment
                                        </label>
                                        {(formData.attachment) && (
                                            <div className="mb-2 text-sm">
                                                Current: <a href={getAssetUrl(formData.attachment)} target="_blank" rel="noopener noreferrer" className="text-primary underline">View Attachment</a>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            className="w-full cursor-pointer rounded-lg border border-stroke bg-transparent py-2 pl-5 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                setFormData({ ...formData, attachment_file: file });
                                            }}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <MultiSelect
                                            id="tags"
                                            label="Tags"
                                            options={tags.map(t => ({ value: String(t.id), text: t.name }))}
                                            defaultValues={formData.tags_ids?.map(String) || []}
                                            onChange={(selected) => {
                                                setFormData({ ...formData, tags_ids: selected.map(Number) });
                                            }}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Expires At
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-5 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            value={formData.expires_at || ""}
                                            onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
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
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    className="bg-dark-2 rounded px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-primary rounded px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : (newsItem ? "Update" : "Create")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
