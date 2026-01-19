"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ActionDropdown from "@/components/Dropdowns/ActionDropdown";
import Pagination from "@/components/Pagination/Pagination";
import DataTableControls from "@/components/Tables/DataTableControls";
import DataTableInfo from "@/components/Tables/DataTableInfo";
import { Application, ApplicationsService } from "@/services/applications.service";
import { useEffect, useState } from "react";
import { getAssetUrl } from "@/lib/utils";

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [formData, setFormData] = useState<Partial<Application>>({
        name: "",
        slug: "",
        url: "",
        icon: "",
        icon_file: null,
        description: "",
        active: true,
    });

    useEffect(() => {
        fetchApplications();
    }, [search, perPage, currentPage]);

    const fetchApplications = async () => {
        setIsLoading(true);
        try {
            const allApps = await ApplicationsService.getApplications();

            // Client-side filtering and pagination (since API likely returns all)
            let filtered = allApps;
            if (search) {
                const lowerSearch = search.toLowerCase();
                filtered = allApps.filter(
                    (app: Application) =>
                        app.name.toLowerCase().includes(lowerSearch) ||
                        app.slug.toLowerCase().includes(lowerSearch)
                );
            }

            setTotalEntries(filtered.length);
            const start = (currentPage - 1) * perPage;
            const paginated = filtered.slice(start, start + perPage);
            setApplications(paginated);
        } catch (error) {
            console.error("Failed to fetch applications", error);
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
        setSelectedApp(null);
        setFormData({
            name: "",
            slug: "",
            url: "",
            icon: "",
            icon_file: null,
            description: "",
            active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (app: Application) => {
        setIsEditing(true);
        setSelectedApp(app);
        setFormData({
            name: app.name,
            slug: app.slug,
            url: app.url,
            icon: app.icon || "",
            icon_file: null,
            description: app.description || "",
            active: app.active,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this application?")) {
            try {
                await ApplicationsService.deleteApplication(id);
                fetchApplications();
            } catch (error) {
                console.error("Failed to delete application", error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("name", formData.name || "");
            data.append("slug", formData.slug || "");
            data.append("url", formData.url || "");
            data.append("description", formData.description || "");
            data.append("active", formData.active ? "1" : "0");

            if (formData.icon_file) {
                data.append("icon", formData.icon_file);
            }

            if (isEditing && selectedApp) {
                await ApplicationsService.updateApplication(selectedApp.id, data);
            } else {
                await ApplicationsService.createApplication(data);
            }
            setIsModalOpen(false);
            fetchApplications();
        } catch (error) {
            console.error("Failed to save application", error);
        }
    };

    return (
        <>
            <Breadcrumb pageName="Applications" />

            <div className="flex flex-col gap-10 text-sm">
                <div className="rounded-[10px] border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:px-7.5">
                    <div className="mb-6 flex items-center justify-between">
                        <h4 className="text-xl font-bold text-dark dark:text-primary">
                            Applications List
                        </h4>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-dark hover:bg-opacity-90 lg:px-6"
                        >
                            Add Application
                        </button>
                    </div>

                    <DataTableControls
                        onSearch={handleSearch}
                        onPerPageChange={handlePerPageChange}
                        perPage={perPage}
                    />

                    <div className="max-w-full overflow-x-auto">
                        <div className="grid grid-cols-4 rounded-t-sm bg-primary text-dark sm:grid-cols-4">
                            <div className="p-2.5">
                                <h5 className="font-medium leading-none xsm:text-base">#</h5>
                            </div>
                            <div className="p-2.5 text-center">
                                <h5 className="text-sm font-medium leading-none xsm:text-base">Title</h5>
                            </div>
                            <div className="p-2.5 text-center">
                                <h5 className="text-sm font-medium leading-none xsm:text-base">Status</h5>
                            </div>
                            <div className="hidden p-2.5 text-center sm:block">
                                <h5 className="text-sm font-medium leading-none xsm:text-base">Actions</h5>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="p-4 text-center">Loading...</div>
                        ) : (
                            applications.map((app, index) => (
                                <div
                                    className={`grid grid-cols-4 sm:grid-cols-4 ${applications.indexOf(app) === applications.length - 1
                                        ? ""
                                        : "border-b border-stroke dark:border-dark-3"
                                        }`}
                                    key={app.id}
                                >
                                    <div className="p-2.5 pt-12.5">
                                        <h5 className="font-medium leading-none xsm:text-base">{index + 1}</h5>
                                    </div>
                                    <div className="flex items-center justify-start p-2.5">
                                        <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-[150px]">
                                            <img src={getAssetUrl(app.icon)} alt={app.name} className="h-20 w-20 object-contain" />
                                            <p className="text-dark leading-tight dark:text-primary">{app.name}</p>
                                        </a>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5">
                                        <span className={`inline-block rounded px-2.5 py-0.5 text-sm font-medium ${app.active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                            {app.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <div className="hidden items-center justify-center p-2.5 sm:flex">
                                        <ActionDropdown
                                            actions={[
                                                {
                                                    label: "Edit",
                                                    onClick: () => openEditModal(app),
                                                },
                                                {
                                                    label: "Delete",
                                                    onClick: () => handleDelete(app.id),
                                                    variant: "danger",
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>
                            ))
                        )}

                        {applications.length === 0 && !isLoading && (
                            <div className="p-4 text-center text-gray-500">No applications found.</div>
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
                    <div className="relative max-h-[90vh] w-full max-w-lg p-4">
                        <div className="relative rounded-lg bg-white shadow dark:bg-gray-dark">
                            <div className="flex items-start justify-between rounded-t border-b p-5 dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {isEditing ? "Edit Application" : "Create Application"}
                                </h3>
                                <button
                                    type="button"
                                    className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-6 p-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter application name"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-5 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Slug <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter slug (e.g., my-app)"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-5 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            URL <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="url"
                                            required
                                            placeholder="https://example.com"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-5 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            value={formData.url}
                                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Icon
                                        </label>
                                        <div className="flex items-center gap-4">
                                            {(formData.icon || formData.icon_file) && (
                                                <div className="h-16 w-16 overflow-hidden rounded border border-stroke dark:border-dark-3">
                                                    <img
                                                        src={formData.icon_file ? URL.createObjectURL(formData.icon_file) : getAssetUrl(formData.icon)}
                                                        alt="Icon Preview"
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="w-full cursor-pointer rounded-lg border border-stroke bg-transparent py-2 pl-5 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    setFormData({ ...formData, icon_file: file });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="mb-2.5 block font-medium text-black dark:text-white">
                                            Description
                                        </label>
                                        <textarea
                                            rows={3}
                                            placeholder="Optional description"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-5 pr-5 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            value={formData.description || ""}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={formData.active}
                                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            />
                                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Active</span>
                                        </label>
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
