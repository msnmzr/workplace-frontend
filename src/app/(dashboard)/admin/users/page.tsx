"use client";

import ActionDropdown from "@/components/Dropdowns/ActionDropdown";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import API from "@/lib/api";
import { RbacService } from "@/services/rbac.service";
import { Permission, Role, User } from "@/types/rbac";
import Pagination from "@/components/Pagination/Pagination";
import DataTableControls from "@/components/Tables/DataTableControls";
import DataTableInfo from "@/components/Tables/DataTableInfo";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
// Debounce helper
import { debounce } from "@/utils/debounce";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);

  // Pagination & DataTable State
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [perPage, setPerPage] = useState(10); // Default per page
  const [search, setSearch] = useState("");

  // User's current access state
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userDirectPermissions, setUserDirectPermissions] = useState<string[]>(
    [],
  );

  const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");

  const fetchUsers = async (page = 1, searchQuery = "", limit = 10) => {
    try {
      setLoading(true);
      let response;
      // Construct query params
      const query = new URLSearchParams({
        page: page.toString(),
        per_page: limit.toString(),
        // Send search in multiple common formats to maximize chance of backend accepting it
        search: searchQuery,
      });

      const endpoint = `/employees?${query.toString()}`;

      try {
        response = await API.get(endpoint);
      } catch (e) {
        console.warn(`Failed to fetch ${endpoint}, trying /users fallback...`);
        response = await API.get(`/users?${query.toString()}`);
      }

      const responseData = response.data;
      const paginationData = responseData.data?.data
        ? responseData.data
        : responseData;

      setUsers(paginationData.data || []);

      if (paginationData.last_page) {
        setLastPage(paginationData.last_page);
      }
      if (paginationData.total) {
        setTotalEntries(paginationData.total);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search handler
  const debouncedFetch = useCallback(
    debounce((query: string, limit: number) => {
      fetchUsers(1, query, limit);
      setCurrentPage(1); // Reset to page 1 on search
    }, 500),
    [],
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    debouncedFetch(value, perPage);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setCurrentPage(1);
    fetchUsers(1, search, value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page, search, perPage);
  };

  const fetchRbacData = async () => {
    try {
      const [roles, permissions] = await Promise.all([
        RbacService.getRoles(),
        RbacService.getPermissions(),
      ]);
      setAllRoles(roles);
      setAllPermissions(permissions);
    } catch (error) {
      console.error("Failed to fetch RBAC structure:", error);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, search, perPage);
    // RBAC data only needs to be fetched once
    if (allRoles.length === 0) fetchRbacData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, perPage]); // Removed search to let debouncedFetch handle it

  const openManageAccessModal = async (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    try {
      const rolesData = await RbacService.getEmployeeRoles(user.emp_id);

      setUserRoles(rolesData.map((r: any) => r.name || r) || []);

      setUserDirectPermissions(user.permissions?.map((p) => p.name) || []);
    } catch (e) {
      console.error("Error fetching user details", e);

      setUserRoles(user.roles?.map((r) => r.name) || []);
      setUserDirectPermissions(user.permissions?.map((p) => p.name) || []);
    }
  };

  const handleToggleRole = async (role: Role) => {
    if (!selectedUser) return;
    const isAssigned = userRoles.includes(role.name);

    try {
      if (isAssigned) {
        await RbacService.removeRoleFromUser(selectedUser.emp_id, role.id);
        setUserRoles((prev) => prev.filter((r) => r !== role.name));
      } else {
        await RbacService.assignRoleToUser(selectedUser.emp_id, role.id);
        setUserRoles((prev) => [...prev, role.name]);
      }
      // Refresh main list
      fetchUsers(currentPage, search, perPage);
    } catch (error: any) {
      console.error("Failed to toggle role:", error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
    }
  };

  const handleTogglePermission = async (permissionName: string) => {
    if (!selectedUser) return;
    const isAssigned = userDirectPermissions.includes(permissionName);

    try {
      if (isAssigned) {
        await RbacService.revokePermissionFromUser(
          selectedUser.emp_id,
          permissionName,
        );
        setUserDirectPermissions((prev) =>
          prev.filter((p) => p !== permissionName),
        );
      } else {
        await RbacService.assignPermissionToUser(
          selectedUser.emp_id,
          permissionName,
        );
        setUserDirectPermissions((prev) => [...prev, permissionName]);
      }
      // Refresh main list
      fetchUsers(currentPage, search, perPage);
    } catch (error) {
      console.error("Failed to toggle permission:", error);
    }
  };

  if (loading && users.length === 0) return <div>Loading...</div>;

  return (
    <>

      <Breadcrumb pageName="Users" />

      <div className="rounded-[10px] border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:px-7.5">
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-xl font-bold text-dark dark:text-primary">
            Users
          </h4>
        </div>
        <DataTableControls
          onSearch={handleSearch}
          onPerPageChange={handlePerPageChange}
          searchValue={search}
          perPage={perPage}
        />

        <div className="flex flex-col text-sm">
          <div className="grid grid-cols-4 rounded-t-sm bg-primary text-black sm:grid-cols-5">
            <div className="p-2.5">
              <h5 className="text-sm font-medium leading-none xsm:text-base">#</h5>
            </div>
            <div className="p-2.5">
              <h5 className="text-sm font-medium leading-none xsm:text-base">
                User
              </h5>
            </div>
            <div className="p-2.5 text-center">
              <h5 className="text-sm font-medium leading-none xsm:text-base">
                Email
              </h5>
            </div>
            <div className="p-2.5 text-center">
              <h5 className="text-sm font-medium leading-none xsm:text-base">
                Roles
              </h5>
            </div>
            <div className="hidden p-2.5 text-center sm:block">
              <h5 className="text-sm font-medium leading-none xsm:text-base">
                Actions
              </h5>
            </div>
          </div>

          {users.slice(0, perPage).map((user, index) => (
            <div
              className={`grid grid-cols-4 sm:grid-cols-5 ${index === users.slice(0, perPage).length - 1
                ? ""
                : "border-b border-stroke dark:border-dark-3"
                }`}
              key={user.emp_id}
            >
              <div className="flex items-center p-2.5">
                <p className="text-dark leading-tight dark:text-primary">
                  {(currentPage - 1) * perPage + index + 1}
                </p>
              </div>

              <div className="flex items-center gap-3 p-2.5">
                <p className="text-dark leading-tight dark:text-primary">{user.emp_name}</p>
              </div>
              <div className="flex items-center justify-center p-2.5">
                <p className="text-dark leading-tight dark:text-primary">{user.emp_email}</p>
              </div>
              <div className="flex items-center justify-center p-2.5">
                <div className="flex flex-wrap justify-center gap-1">
                  {user.roles?.map((role) => (
                    <span
                      key={role.id}
                      className="inline-block rounded-full bg-black/50 font-semibold px-2 py-1 text-xs font-medium leading-none text-primary dark:text-black dark:bg-primary"
                    >
                      {role.name}
                    </span>
                  ))}
                  {(!user.roles || user.roles.length === 0) && (
                    <span className="text-sm leading-tight text-gray-500 dark:text-primary">-</span>
                  )}
                </div>
              </div>
              <div className="hidden items-center justify-center p-2.5 sm:flex">
                <ActionDropdown
                  actions={[
                    {
                      label: "Manage Access",
                      onClick: () => openManageAccessModal(user),
                    },
                  ]}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="dark:border-strokedark dark:border-primary mt-4 flex items-center justify-between border-t border-stroke">
          <DataTableInfo
            totalEntries={totalEntries}
            currentPage={currentPage}
            perPage={perPage}
          />

          {lastPage > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={lastPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div >

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 outline-none focus:outline-none">
          <div className="relative max-h-[90vh] w-full max-w-3xl p-4">
            <div className="dark:bg-boxdark relative flex max-h-full flex-col rounded-lg bg-white shadow">
              <div className="dark:border-strokedark flex items-center justify-between rounded-t border-b p-4">
                <h3 className="text-xl font-semibold text-black dark:text-black">
                  Manage Access: {selectedUser.emp_name}
                </h3>
                <button
                  className="float-right ml-auto border-0 bg-transparent text-3xl font-semibold leading-none text-black outline-none focus:outline-none dark:text-primary"
                  onClick={() => setIsModalOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className="dark:border-strokedark border-b border-stroke">
                <div className="flex">
                  <button
                    className={`flex-1 py-3 text-center font-medium ${activeTab === "roles" ? "border-b-2 border-primary text-primary" : "text-body hover:text-primary"}`}
                    onClick={() => setActiveTab("roles")}
                  >
                    User Roles
                  </button>
                  <button
                    className={`flex-1 py-3 text-center font-medium ${activeTab === "permissions" ? "border-b-2 border-primary text-primary" : "text-body hover:text-primary"}`}
                    onClick={() => setActiveTab("permissions")}
                  >
                    Direct Permissions
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto p-6">
                {activeTab === "roles" ? (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {allRoles.map((role) => (
                      <label
                        key={role.id}
                        className="flex cursor-pointer items-center space-x-3 rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-primary"
                          checked={userRoles.includes(role.name)}
                          onChange={() => handleToggleRole(role)}
                        />
                        <span className="text-black dark:text-primary">
                          {role.name}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {allPermissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex cursor-pointer items-center space-x-3 rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-primary"
                          checked={userDirectPermissions.includes(
                            permission.name,
                          )}
                          onChange={() =>
                            handleTogglePermission(permission.name)
                          }
                        />
                        <span className="text-black dark:text-primary">
                          {permission.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="dark:border-strokedark flex justify-end border-t border-stroke p-4">
                <button
                  className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90"
                  onClick={() => setIsModalOpen(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </>
  );
}
