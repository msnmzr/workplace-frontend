"use client";

import { MenuItem } from "@/types/settings";
import { useEffect, useState } from "react";

interface MenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<MenuItem, "id" | "created_at" | "updated_at">) => Promise<void>;
    editingMenu: MenuItem | null;
    allMenus: MenuItem[];
}

export default function MenuModal({
    isOpen,
    onClose,
    onSave,
    editingMenu,
    allMenus,
}: MenuModalProps) {
    const [formData, setFormData] = useState({
        label: "",
        url: "",
        parent_id: "" as string | number, // empty string for no parent
        order: 0,
        is_active: true,
    });

    useEffect(() => {
        if (editingMenu) {
            setFormData({
                label: editingMenu.label,
                url: editingMenu.url,
                parent_id: editingMenu.parent_id !== null && editingMenu.parent_id !== undefined ? editingMenu.parent_id : "",
                order: editingMenu.order,
                is_active: editingMenu.is_active,
            });
        } else {
            setFormData({
                label: "",
                url: "",
                parent_id: "",
                order: 0,
                is_active: true,
            });
        }
    }, [editingMenu, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            parent_id: formData.parent_id === "" ? null : Number(formData.parent_id)
        }
        await onSave(dataToSave);
        onClose();
    };

    // Filter out self from parent options to avoid cycles (simple check)
    const parentOptions = allMenus.filter(m => !editingMenu || m.id !== editingMenu.id);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-999999 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 outline-none focus:outline-none">
            <div className="relative w-full max-w-lg p-4">
                <div className="dark:bg-boxdark relative rounded-lg bg-white shadow">
                    <div className="dark:border-strokedark flex items-center justify-between rounded-t border-b p-4">
                        <h3 className="text-xl font-semibold text-black dark:text-white">
                            {editingMenu ? "Edit Menu Item" : "Add Menu Item"}
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
                                    Label
                                </label>
                                <input
                                    type="text"
                                    placeholder="Menu Label"
                                    value={formData.label}
                                    onChange={(e) =>
                                        setFormData({ ...formData, label: e.target.value })
                                    }
                                    className="disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:focus:border-primary"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    URL
                                </label>
                                <input
                                    type="text"
                                    placeholder="/example"
                                    value={formData.url}
                                    onChange={(e) =>
                                        setFormData({ ...formData, url: e.target.value })
                                    }
                                    className="disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:focus:border-primary"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium text-black dark:text-white">
                                    Parent Menu (Optional)
                                </label>
                                <select
                                    value={formData.parent_id}
                                    onChange={(e) =>
                                        setFormData({ ...formData, parent_id: e.target.value })
                                    }
                                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    <option value="">No Parent (Top Level)</option>
                                    {parentOptions.map((menu) => (
                                        <option key={menu.id} value={menu.id}>
                                            {menu.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4 flex gap-6">
                                <div className="w-1/2">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Order
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={formData.order}
                                        onChange={(e) =>
                                            setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                                        }
                                        className="disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:focus:border-primary"
                                    />
                                </div>
                                <div className="w-1/2 flex items-center pt-8">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Active</span>
                                    </label>
                                </div>
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
