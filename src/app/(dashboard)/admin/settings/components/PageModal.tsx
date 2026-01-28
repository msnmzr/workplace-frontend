"use client";

import { StaticPage } from "@/types/settings";
import { useEffect, useState } from "react";

interface PageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<StaticPage, "id" | "created_at" | "updated_at">) => Promise<void>;
    editingPage: StaticPage | null;
}

export default function PageModal({
    isOpen,
    onClose,
    onSave,
    editingPage,
}: PageModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        is_published: true,
    });

    useEffect(() => {
        if (editingPage) {
            setFormData({
                title: editingPage.title,
                slug: editingPage.slug,
                content: editingPage.content,
                is_published: editingPage.is_published,
            });
        } else {
            setFormData({
                title: "",
                slug: "",
                content: "",
                is_published: true,
            });
        }
    }, [editingPage, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
        onClose();
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        // Simple slug generation if editingPage is null (new page) or slug is empty
        if (!editingPage && !formData.slug) {
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, title, slug }));
        } else {
            setFormData(prev => ({ ...prev, title }));
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-999999 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 outline-none focus:outline-none">
            <div className="relative w-full max-w-2xl p-4">
                <div className="dark:bg-boxdark relative rounded-lg bg-white shadow">
                    <div className="dark:border-strokedark flex items-center justify-between rounded-t border-b p-4">
                        <h3 className="text-xl font-semibold text-black dark:text-white">
                            {editingPage ? "Edit Page" : "Add Page"}
                        </h3>
                        <button
                            className="float-right ml-auto border-0 bg-transparent text-3xl font-semibold leading-none text-black outline-none focus:outline-none dark:text-white"
                            onClick={onClose}
                        >
                            ×
                        </button>
                    </div>
                    <div className="p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Page Title"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    className="disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:focus:border-primary"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Slug
                                </label>
                                <input
                                    type="text"
                                    placeholder="page-slug"
                                    value={formData.slug}
                                    onChange={(e) =>
                                        setFormData({ ...formData, slug: e.target.value })
                                    }
                                    className="disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:focus:border-primary"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Content
                                </label>
                                <textarea
                                    rows={8}
                                    placeholder="Page Content (HTML support pending)"
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData({ ...formData, content: e.target.value })
                                    }
                                    className="disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:focus:border-primary"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_published}
                                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Published</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    className="bg-dark-2 rounded px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
