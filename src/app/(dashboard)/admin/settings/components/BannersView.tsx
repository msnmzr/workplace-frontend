"use client";

import ActionDropdown from "@/components/Dropdowns/ActionDropdown";
import Pagination from "@/components/Pagination/Pagination";
import DataTableControls from "@/components/Tables/DataTableControls";
import DataTableInfo from "@/components/Tables/DataTableInfo";
import { useClientTable } from "@/hooks/useClientTable";
import { SettingsService } from "@/services/settings.service";
import { Banner } from "@/types/settings";
import React, { useEffect, useState } from "react";
import BannerModal from "./BannerModal";
import Image from "next/image";
import Loader from "@/components/common/Loader";

export default function BannersView() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const data = await SettingsService.getBanners();
            setBanners(data);
        } catch (error) {
            console.error("Failed to fetch banners:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const {
        data: paginatedBanners,
        currentPage,
        setCurrentPage,
        perPage,
        setPerPage,
        search,
        setSearch,
        totalEntries,
        totalPages,
    } = useClientTable({
        data: banners,
        searchKeys: ["title", "description"],
        initialPerPage: 10,
    });

    const handleSave = async (data: any) => {
        try {
            if (editingBanner) {
                await SettingsService.updateBanner(editingBanner.id, data);
            } else {
                await SettingsService.createBanner(data);
            }
            fetchBanners();
        } catch (error) {
            console.error("Failed to save banner:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this banner?")) {
            try {
                await SettingsService.deleteBanner(id);
                fetchBanners();
            } catch (error) {
                console.error("Failed to delete banner:", error);
            }
        }
    };

    const openCreateModal = () => {
        setEditingBanner(null);
        setIsModalOpen(true);
    };

    const openEditModal = (banner: Banner) => {
        setEditingBanner(banner);
        setIsModalOpen(true);
    };

    if (loading && banners.length === 0) return <Loader />;

    return (
        <>
            <div className="rounded-[10px] border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:px-7.5">
                <div className="mb-6 flex items-center justify-between">
                    <h4 className="text-xl font-bold text-dark dark:text-white">
                        All Banners
                    </h4>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-dark hover:bg-opacity-90 lg:px-6 text-sm"
                    >
                        Add Banner
                    </button>
                </div>

                <DataTableControls
                    onSearch={setSearch}
                    searchValue={search}
                    perPage={perPage}
                    onPerPageChange={setPerPage}
                />

                <div className="flex flex-col text-sm">
                    <div className="grid grid-cols-5 rounded-t-sm bg-primary text-dark sm:grid-cols-6">
                        <div className="p-2.5">
                            <h5 className="font-medium leading-none xsm:text-base">Order</h5>
                        </div>
                        <div className="p-2.5 text-center">
                            <h5 className="font-medium leading-none xsm:text-base">Image</h5>
                        </div>
                        <div className="p-2.5 col-span-2">
                            <h5 className="font-medium leading-none xsm:text-base">Details</h5>
                        </div>
                        <div className="p-2.5 text-center">
                            <h5 className="font-medium leading-none xsm:text-base">Status</h5>
                        </div>
                        <div className="hidden p-2.5 text-center sm:block">
                            <h5 className="font-medium leading-none xsm:text-base">Actions</h5>
                        </div>
                    </div>

                    {paginatedBanners.map((banner, index) => (
                        <div
                            className={`grid grid-cols-5 sm:grid-cols-6 ${paginatedBanners.indexOf(banner) ===
                                paginatedBanners.length - 1
                                ? ""
                                : "border-b border-stroke dark:border-dark-3"
                                }`}
                            key={banner.id}
                        >
                            <div className="flex items-center p-2.5">
                                <p className="text-dark leading-tight dark:text-white">
                                    {banner.order}
                                </p>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <div className="relative h-12 w-20 overflow-hidden rounded">
                                    {/* Using img for external URLs if not configured in next.config.js, otherwise use Image */}
                                    <img src={banner.image_url} alt={banner.title} className="h-full w-full object-cover" />
                                </div>
                            </div>
                            <div className="flex flex-col justify-center p-2.5 col-span-2">
                                <p className="text-dark font-medium leading-tight dark:text-white">{banner.title}</p>
                                {banner.link_url && <span className="text-xs text-body">Link: {banner.link_url}</span>}
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span
                                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${banner.is_active
                                        ? "bg-success text-success"
                                        : "bg-danger text-danger"
                                        }`}
                                >
                                    {banner.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <div className="hidden items-center justify-center p-2.5 sm:flex">
                                <ActionDropdown
                                    actions={[
                                        {
                                            label: "Edit",
                                            onClick: () => openEditModal(banner),
                                        },
                                        {
                                            label: "Delete",
                                            onClick: () => handleDelete(banner.id),
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

            <BannerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editingBanner={editingBanner}
            />
        </>
    );
}
