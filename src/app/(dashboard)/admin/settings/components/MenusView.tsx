"use client";

import ActionDropdown from "@/components/Dropdowns/ActionDropdown";
import Pagination from "@/components/Pagination/Pagination";
import DataTableControls from "@/components/Tables/DataTableControls";
import DataTableInfo from "@/components/Tables/DataTableInfo";
import { useClientTable } from "@/hooks/useClientTable";
import { SettingsService } from "@/services/settings.service";
import { MenuItem } from "@/types/settings";
import React, { useEffect, useState } from "react";
import MenuModal from "./MenuModal";
import Loader from "@/components/common/Loader";

export default function MenusView() {
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);

    const fetchMenus = async () => {
        try {
            setLoading(true);
            const data = await SettingsService.getMenus();
            setMenus(data);
        } catch (error) {
            console.error("Failed to fetch menus:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const {
        data: paginatedMenus,
        currentPage,
        setCurrentPage,
        perPage,
        setPerPage,
        search,
        setSearch,
        totalEntries,
        totalPages,
    } = useClientTable({
        data: menus,
        searchKeys: ["label", "url"],
        initialPerPage: 10,
    });

    const handleSave = async (data: any) => {
        try {
            if (editingMenu) {
                await SettingsService.updateMenu(editingMenu.id, data);
            } else {
                await SettingsService.createMenu(data);
            }
            fetchMenus();
        } catch (error) {
            console.error("Failed to save menu:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this menu item?")) {
            try {
                await SettingsService.deleteMenu(id);
                fetchMenus();
            } catch (error) {
                console.error("Failed to delete menu:", error);
            }
        }
    };

    const openCreateModal = () => {
        setEditingMenu(null);
        setIsModalOpen(true);
    };

    const openEditModal = (menu: MenuItem) => {
        setEditingMenu(menu);
        setIsModalOpen(true);
    };

    if (loading && menus.length === 0) return <Loader />;

    return (
        <>
            <div className="rounded-[10px] border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:px-7.5">
                <div className="mb-6 flex items-center justify-between">
                    <h4 className="text-xl font-bold text-dark dark:text-white">
                        All Menu Items
                    </h4>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-dark hover:bg-opacity-90 lg:px-6 text-sm"
                    >
                        Add Menu Item
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
                            <h5 className="font-medium leading-none xsm:text-base">Order</h5>
                        </div>
                        <div className="p-2.5 text-center">
                            <h5 className="font-medium leading-none xsm:text-base">Label</h5>
                        </div>
                        <div className="p-2.5 text-center">
                            <h5 className="font-medium leading-none xsm:text-base">URL</h5>
                        </div>
                        <div className="hidden p-2.5 text-center sm:block">
                            <h5 className="font-medium leading-none xsm:text-base">Status</h5>
                        </div>
                        <div className="hidden p-2.5 text-center sm:block">
                            <h5 className="font-medium leading-none xsm:text-base">Actions</h5>
                        </div>
                    </div>

                    {paginatedMenus.map((menu, index) => (
                        <div
                            className={`grid grid-cols-4 sm:grid-cols-5 ${paginatedMenus.indexOf(menu) ===
                                paginatedMenus.length - 1
                                ? ""
                                : "border-b border-stroke dark:border-dark-3"
                                }`}
                            key={menu.id}
                        >
                            <div className="flex items-center p-2.5">
                                <p className="text-dark leading-tight dark:text-white">
                                    {menu.order}
                                </p>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <p className="text-dark leading-tight dark:text-white">{menu.label}</p>
                                {menu.parent_id && <span className="ml-2 text-xs text-body">(Child)</span>}
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <p className="text-dark leading-tight dark:text-white">{menu.url}</p>
                            </div>
                            <div className="hidden items-center justify-center p-2.5 sm:flex">
                                <span
                                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${menu.is_active
                                        ? "bg-success text-success"
                                        : "bg-danger text-danger"
                                        }`}
                                >
                                    {menu.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <div className="hidden items-center justify-center p-2.5 sm:flex">
                                <ActionDropdown
                                    actions={[
                                        {
                                            label: "Edit",
                                            onClick: () => openEditModal(menu),
                                        },
                                        {
                                            label: "Delete",
                                            onClick: () => handleDelete(menu.id),
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

            <MenuModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editingMenu={editingMenu}
                allMenus={menus}
            />
        </>
    );
}
