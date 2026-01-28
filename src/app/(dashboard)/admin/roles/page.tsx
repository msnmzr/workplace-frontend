"use client";

import ActionDropdown from "@/components/Dropdowns/ActionDropdown";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Pagination from "@/components/Pagination/Pagination";
import DataTableControls from "@/components/Tables/DataTableControls";
import DataTableInfo from "@/components/Tables/DataTableInfo";
import { useClientTable } from "@/hooks/useClientTable";
import { RbacService } from "@/services/rbac.service";
import { Permission, Role } from "@/types/rbac";
import { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    permissions: number[];
  }>({ name: "", permissions: [] });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesData, permissionsData] = await Promise.all([
        RbacService.getRoles(),
        RbacService.getPermissions(),
      ]);
      setRoles(rolesData);
      setAllPermissions(permissionsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    data: paginatedRoles,
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    search,
    setSearch,
    totalEntries,
    totalPages,
  } = useClientTable({
    data: roles,
    searchKeys: ["name"],
    initialPerPage: 10,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await RbacService.updateRole(editingRole.id, formData);
      } else {
        await RbacService.createRole(formData);
      }
      setIsModalOpen(false);
      setEditingRole(null);
      setFormData({ name: "", permissions: [] });
      fetchData(); // Refresh to show new/updated role
    } catch (error) {
      console.error("Failed to save role:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this role?")) {
      try {
        await RbacService.deleteRole(id);
        fetchData();
      } catch (error) {
        console.error("Failed to delete role:", error);
      }
    }
  };

  const openCreateModal = () => {
    setEditingRole(null);
    setFormData({ name: "", permissions: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      permissions: role.permissions?.map((p) => p.id) || [],
    });
    setIsModalOpen(true);
  };

  const togglePermission = (permissionId: number) => {
    setFormData((prev) => {
      const permissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId];
      return { ...prev, permissions };
    });
  };



  return (
    <>
      <Breadcrumb pageName="Roles" />

      <div className="flex flex-col gap-10 text-sm">
        <div className="rounded-[10px] border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:px-7.5">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="text-xl font-bold text-dark dark:text-primary">
              All Roles
            </h4>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-dark hover:bg-opacity-90 lg:px-6"
            >
              Add Role
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
                <h5 className="text-sm font-medium leading-none xsm:text-base">
                  #
                </h5>
              </div>
              <div className="p-2.5">
                <h5 className="text-sm font-medium leading-none xsm:text-base">
                  ID
                </h5>
              </div>
              <div className="p-2.5 text-center">
                <h5 className="text-sm font-medium leading-none xsm:text-base">
                  Name
                </h5>
              </div>
              <div className="p-2.5 text-center">
                <h5 className="text-sm font-medium leading-none xsm:text-base">
                  Permissions
                </h5>
              </div>
              <div className="hidden p-2.5 text-center sm:block">
                <h5 className="text-sm font-medium leading-none xsm:text-base">
                  Actions
                </h5>
              </div>
            </div>

            {loading ? (
              <Loader />
            ) : (
              paginatedRoles.map((role, index) => (
                <div
                  className={`grid grid-cols-4 sm:grid-cols-5 ${paginatedRoles.indexOf(role) === paginatedRoles.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-dark-3"
                    }`}
                  key={role.id}
                >
                  <div className="flex items-center p-2.5">
                    <p className="text-dark leading-tight dark:text-primary">
                      {(currentPage - 1) * perPage + index + 1}
                    </p>
                  </div>
                  <div className="flex items-center justify-start p-2.5">
                    <p className="text-dark leading-tight dark:text-primary">{role.id}</p>
                  </div>
                  <div className="flex items-center justify-center p-2.5">
                    <p className="text-dark leading-tight dark:text-primary">{role.name}</p>
                  </div>
                  <div className="flex items-center justify-center p-2.5">
                    <p className="text-sm leading-tight text-dark dark:text-primary">
                      {role.permissions?.length || 0} Permissions
                    </p>
                  </div>
                  <div className="hidden items-center justify-center p-2.5 sm:flex">
                    <ActionDropdown
                      actions={[
                        {
                          label: "Edit",
                          onClick: () => openEditModal(role),
                        },
                        {
                          label: "Delete",
                          onClick: () => handleDelete(role.id),
                          variant: "danger",
                        },
                      ]}
                    />
                  </div>
                </div>
              ))
            )}

            {!loading && paginatedRoles.length === 0 && (
              <div className="p-4 text-center text-gray-500">No roles found.</div>
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
          <div className="relative max-h-[90vh] w-full max-w-3xl p-4">
            <div className="dark:bg-boxdark relative flex max-h-full flex-col rounded-lg bg-white shadow">
              <div className="dark:border-strokedark flex items-center justify-between rounded-t border-b p-4">
                <h3 className="text-xl font-semibold text-black dark:text-primary">
                  {editingRole ? "Edit Role" : "Add Role"}
                </h3>
                <button
                  className="float-right ml-auto border-0 bg-transparent text-3xl font-semibold leading-none text-black outline-none focus:outline-none dark:text-primary"
                  onClick={() => setIsModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="overflow-y-auto p-6">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-primary">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Role Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:focus:border-primary"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <div className="mb-2.5 flex items-center justify-between">
                      <label className="block font-medium text-black dark:text-primary">
                        Permissions
                      </label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, permissions: allPermissions.map(p => p.id) })}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, permissions: [] })}
                          className="text-xs font-semibold text-danger hover:underline"
                        >
                          Deselect All
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {allPermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center space-x-2"
                        >
                          {/* Using simple input checkbox for simplicity - consistent with no external deps */}
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-800"
                            checked={formData.permissions.includes(
                              permission.id,
                            )}
                            onChange={() => togglePermission(permission.id)}
                          />
                          <span className="text-black dark:text-primary">
                            {permission.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      type="button"
                      className="bg-danger rounded px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
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
