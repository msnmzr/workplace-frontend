"use client";

import { useState, useEffect } from "react";
import { NewsTag, NewsService } from "@/services/news.service";
import ActionDropdown from "@/components/Dropdowns/ActionDropdown";
import Loader from "@/components/common/Loader";

export default function TagManager() {
    const [tags, setTags] = useState<NewsTag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTag, setCurrentTag] = useState<Partial<NewsTag>>({ name: "" });

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        setIsLoading(true);
        try {
            const data = await NewsService.getTags();
            if (Array.isArray(data)) {
                setTags(data);
            }
        } catch (error) {
            console.error("Failed to fetch tags", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setCurrentTag({ name: "" });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleEdit = (tag: NewsTag) => {
        setCurrentTag(tag);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this tag?")) {
            try {
                await NewsService.deleteTag(id);
                fetchTags();
            } catch (error) {
                console.error("Failed to delete tag", error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentTag.id) {
                await NewsService.updateTag(currentTag.id, currentTag);
            } else {
                await NewsService.createTag(currentTag);
            }
            setIsModalOpen(false);
            fetchTags();
        } catch (error) {
            console.error("Failed to save tag", error);
        }
    };

    return (
        <div className="rounded-[10px] border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:px-7.5">
            <div className="mb-6 flex items-center justify-between">
                <h4 className="text-xl font-bold text-dark dark:text-primary">
                    News Tags
                </h4>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-dark hover:bg-opacity-90 lg:px-6"
                >
                    Add Tag
                </button>
            </div>

            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                Name
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={2} className="px-4 py-5 text-center"><Loader /></td>
                            </tr>
                        ) : (
                            tags.map((tag) => (
                                <tr key={tag.id}>
                                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {tag.name}
                                        </h5>
                                    </td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                        <div className="flex items-center justify-end">
                                            <ActionDropdown
                                                actions={[
                                                    {
                                                        label: "Edit",
                                                        onClick: () => handleEdit(tag),
                                                    },
                                                    {
                                                        label: "Delete",
                                                        onClick: () => handleDelete(tag.id),
                                                        variant: "danger",
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        {tags.length === 0 && !isLoading && (
                            <tr>
                                <td colSpan={2} className="px-4 py-5 text-center text-gray-500">
                                    No tags found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-999999 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 outline-none focus:outline-none">
                    <div className="relative w-full max-w-md p-4">
                        <div className="relative rounded-lg bg-white shadow dark:bg-gray-dark">
                            <div className="flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {isEditing ? "Edit Tag" : "Add Tag"}
                                </h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    type="button"
                                    className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter tag name"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-5 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            value={currentTag.name}
                                            onChange={(e) => setCurrentTag({ ...currentTag, name: e.target.value })}
                                        />
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
        </div>
    );
}
