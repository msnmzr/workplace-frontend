"use client";

import ActionDropdown from "@/components/Dropdowns/ActionDropdown";
import Pagination from "@/components/Pagination/Pagination";
import DataTableControls from "@/components/Tables/DataTableControls";
import DataTableInfo from "@/components/Tables/DataTableInfo";
import { useClientTable } from "@/hooks/useClientTable";
import { SettingsService } from "@/services/settings.service";
import { StaticPage } from "@/types/settings";
import React, { useEffect, useState } from "react";
import PageModal from "./PageModal";
import Loader from "@/components/common/Loader";

export default function PagesView() {
    const [pages, setPages] = useState<StaticPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<StaticPage | null>(null);

    const fetchPages = async () => {
        try {
            setLoading(true);
            const data = await SettingsService.getPages();
            setPages(data);
        } catch (error) {
            console.error("Failed to fetch pages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const {
        data: paginatedPages,
        currentPage,
        setCurrentPage,
        perPage,
        setPerPage,
        search,
        setSearch,
        totalEntries,
        totalPages,
    } = useClientTable({
        data: pages,
        searchKeys: ["title", "slug"],
        initialPerPage: 10,
    });

    const handleSave = async (data: any) => {
        try {
            if (editingPage) {
                await SettingsService.updatePage(editingPage.id, data);
            } else {
                await SettingsService.createPage(data);
            }
            fetchPages();
        } catch (error) {
            console.error("Failed to save page:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this page?")) {
            try {
                await SettingsService.deletePage(id);
                fetchPages();
            } catch (error) {
                console.error("Failed to delete page:", error);
            }
        }
    };

    const openCreateModal = () => {
        setEditingPage(null);
        setIsModalOpen(true);
    };

    const openEditModal = (page: StaticPage) => {
        setEditingPage(page);
        setIsModalOpen(true);
    };

    if (loading && pages.length === 0) return <Loader />;

    return (
        <>
            <div className="rounded-[10px] border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:px-7.5">
                <div className="mb-6 flex items-center justify-between">
                    <h4 className="text-xl font-bold text-dark dark:text-white">
                        All Pages
                    </h4>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-dark hover:bg-opacity-90 lg:px-6 text-sm"
                    >
                        Add Page
                    </button>
                </div>

                <DataTableControls
                    onSearch={setSearch}
                    searchValue={search}
                    perPage={perPage}
                    onPerPageChange={setPerPage}
                />

                <div className="flex flex-col text-sm">
                    <div className="grid grid-cols-4 rounded-t-sm bg-primary text-dark sm:grid-cols-5">
                        <div className="p-2.5">
                            <h5 className="font-medium leading-none xsm:text-base">Title</h5>
                        </div>
                        <div className="p-2.5 text-center">
                            <h5 className="font-medium leading-none xsm:text-base">Slug</h5>
                        </div>
                        <div className="p-2.5 text-center hidden sm:block">
                            <h5 className="font-medium leading-none xsm:text-base">Status</h5>
                        </div>
                        <div className="p-2.5 text-center">
                            <h5 className="font-medium leading-none xsm:text-base">Preview</h5>
                        </div>
                        <div className="hidden p-2.5 text-center sm:block">
                            <h5 className="font-medium leading-none xsm:text-base">Actions</h5>
                        </div>
                    </div>

                    {paginatedPages.map((page, index) => (
                        <div
                            className={`grid grid-cols-4 sm:grid-cols-5 ${paginatedPages.indexOf(page) ===
                                paginatedPages.length - 1
                                ? ""
                                : "border-b border-stroke dark:border-dark-3"
                                }`}
                            key={page.id}
                        >
                            <div className="flex items-center p-2.5">
                                <p className="text-dark leading-tight dark:text-white">
                                    {page.title}
                                </p>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <p className="text-dark leading-tight dark:text-white">{page.slug}</p>
                            </div>
                            <div className="hidden items-center justify-center p-2.5 sm:flex">
                                <span
                                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${page.is_published
                                        ? "bg-success text-success"
                                        : "bg-warning text-warning"
                                        }`}
                                >
                                    {page.is_published ? "Published" : "Draft"}
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <a href={`/pages/${page.slug}`} target="_blank" className="text-primary hover:underline" rel="noreferrer">
                                    View
                                </a>
                            </div>
                            <div className="hidden items-center justify-center p-2.5 sm:flex">
                                <ActionDropdown
                                    actions={[
                                        {
                                            label: "Edit",
                                            onClick: () => openEditModal(page),
                                        },
                                        {
                                            label: "Delete",
                                            onClick: () => handleDelete(page.id),
                                            variant: "danger",
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    ))}
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

            <PageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editingPage={editingPage}
            />
        </>
    );
}
