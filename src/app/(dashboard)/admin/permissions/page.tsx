"use client";

import ActionDropdown from "@/components/Dropdowns/ActionDropdown";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Pagination from "@/components/Pagination/Pagination";
import DataTableControls from "@/components/Tables/DataTableControls";
import DataTableInfo from "@/components/Tables/DataTableInfo";
import { useClientTable } from "@/hooks/useClientTable";
import { RbacService } from "@/services/rbac.service";
import { Permission } from "@/types/rbac";
import { useEffect, useState } from "react";

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null,
  );
  const [formData, setFormData] = useState({ name: "" });

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const data = await RbacService.getPermissions();
      setPermissions(data);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const {
    data: paginatedPermissions,
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    totalEntries,
    totalPages,
  } = useClientTable({
    data: permissions,
    searchKeys: ["name", "guard_name" as keyof Permission],
    initialPerPage: 10,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPermission) {
        await RbacService.updatePermission(editingPermission.id, formData);
      } else {
        await RbacService.createPermission(formData);
      }
      setIsModalOpen(false);
      setEditingPermission(null);
      setFormData({ name: "" });
      fetchPermissions();
    } catch (error) {
      console.error("Failed to save permission:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this permission?")) {
      try {
        await RbacService.deletePermission(id);
        fetchPermissions();
      } catch (error) {
        console.error("Failed to delete permission:", error);
      }
    }
  };

  const openCreateModal = () => {
    setEditingPermission(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (permission: Permission) => {
    setEditingPermission(permission);
    setFormData({ name: permission.name });
    setIsModalOpen(true);
  };

  if (loading && permissions.length === 0) return <div>Loading...</div>;

  return (
    <>
      <Breadcrumb pageName="Permissions" />

      <div className="flex flex-col gap-10">
        <div className="rounded-[10px] border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:px-7.5">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="text-xl font-bold text-dark dark:text-primary">
              All Permissions
            </h4>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-dark hover:bg-opacity-90 lg:px-6 text-sm"
            >
              Add Permission
            </button>
          </div>

          <DataTableControls
            onSearch={setSearch}
            searchValue={search}
            perPage={perPage}
            onPerPageChange={setPerPage}
          />

          <div className="flex flex-col text-sm">
            <div className="grid grid-cols-3 rounded-t-sm bg-primary text-dark sm:grid-cols-4">
              <div className="p-2.5">
                <h5 className="font-medium leading-none xsm:text-base">#</h5>
              </div>
              <div className="p-2.5 text-center">
                <h5 className="font-medium leading-none xsm:text-base">Name</h5>
              </div>
              <div className="p-2.5 text-center">
                <h5 className="font-medium leading-none xsm:text-base">Guard</h5>
              </div>
              <div className="hidden p-2.5 text-center sm:block">
                <h5 className="font-medium leading-none xsm:text-base">Actions</h5>
              </div>
            </div>

            {paginatedPermissions.map((permission, index) => (
              <div
                className={`grid grid-cols-3 sm:grid-cols-4 ${paginatedPermissions.indexOf(permission) ===
                  paginatedPermissions.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-dark-3"
                  }`}
                key={permission.id}
              >
                <div className="flex items-center p-2.5">
                  <p className="text-dark leading-tight dark:text-primary">
                    {(currentPage - 1) * perPage + index + 1}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-dark leading-tight dark:text-primary">{permission.name}</p>
                </div>
                <div className="flex items-center justify-center p-2.5">
                  <p className="text-dark leading-tight dark:text-primary">
                    {permission.guard_name}
                  </p>
                </div>
                <div className="hidden items-center justify-center p-2.5 sm:flex">
                  <ActionDropdown
                    actions={[
                      {
                        label: "Edit",
                        onClick: () => openEditModal(permission),
                      },
                      {
                        label: "Delete",
                        onClick: () => handleDelete(permission.id),
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 outline-none focus:outline-none">
          <div className="relative w-full max-w-md p-4">
            <div className="dark:bg-boxdark relative rounded-lg bg-white shadow">
              <div className="dark:border-strokedark flex items-center justify-between rounded-t border-b p-4">
                <h3 className="text-xl font-semibold text-black dark:text-primary">
                  {editingPermission ? "Edit Permission" : "Add Permission"}
                </h3>
                <button
                  className="float-right ml-auto border-0 bg-transparent text-3xl font-semibold leading-none text-black outline-none focus:outline-none dark:text-primary"
                  onClick={() => setIsModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-primary">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Permission Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:focus:border-primary"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      className="bg-dark-2 rounded px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
                      onClick={() => setIsModalOpen(false)}
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
      )}
    </>
  );
}
