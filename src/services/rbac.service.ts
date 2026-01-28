import API from "@/lib/api";
import { API_URLS } from "@/config/api-urls";
import { Permission, Role, User } from "@/types/rbac";

export const RbacService = {
  // --- Permissions ---
  getPermissions: async () => {
    const response = await API.get<any>(API_URLS.PERMISSIONS.LIST);
    // Handle both wrapped { data: [...] } and unwrapped [...] responses
    const data = response.data?.data || response.data;
    return Array.isArray(data) ? data : [];
  },
  createPermission: async (data: { name: string }) => {
    const response = await API.post(API_URLS.PERMISSIONS.CREATE, data);
    return response.data;
  },
  updatePermission: async (id: number, data: { name: string }) => {
    const response = await API.put(API_URLS.PERMISSIONS.UPDATE(id), data);
    return response.data;
  },
  deletePermission: async (id: number) => {
    const response = await API.delete(API_URLS.PERMISSIONS.DELETE(id));
    return response.data;
  },

  // --- Roles ---
  getRoles: async () => {
    const response = await API.get<any>(API_URLS.ROLES.LIST);
    const data = response.data?.data || response.data;
    return Array.isArray(data) ? data : [];
  },
  getRole: async (id: number) => {
    const response = await API.get<{ data: Role }>(API_URLS.ROLES.DETAILS(id));
    return response.data.data;
  },
  createRole: async (data: { name: string; permissions?: number[] }) => {
    const response = await API.post(API_URLS.ROLES.CREATE, data);
    return response.data;
  },
  updateRole: async (id: number, data: { name: string; permissions?: number[] }) => {
    const response = await API.put(API_URLS.ROLES.UPDATE(id), data);
    return response.data;
  },
  deleteRole: async (id: number) => {
    const response = await API.delete(API_URLS.ROLES.DELETE(id));
    return response.data;
  },

  // --- User Roles & Permissions ---
  getEmployeeRoles: async (empId: number) => {
    const response = await API.get(API_URLS.EMPLOYEES.ROLES(empId));

    // Handle { roles: [...] } format
    if (response.data?.roles) {
      return Array.isArray(response.data.roles) ? response.data.roles : [];
    }

    const data = response.data?.data || response.data;
    return Array.isArray(data) ? data : [];
  },
  assignRoleToUser: async (empId: number, roleId: number) => {
    const response = await API.post(API_URLS.EMPLOYEES.ASSIGN_ROLE(empId), { roles: [roleId] });
    return response.data;
  },
  removeRoleFromUser: async (empId: number, roleId: number) => {
    const response = await API.post(API_URLS.EMPLOYEES.REMOVE_ROLE(empId), { roles: [roleId] });
    return response.data;
  },
  syncUserRoles: async (empId: number, roles: string[]) => {
    const response = await API.post(API_URLS.EMPLOYEES.SYNC_ROLES(empId), { roles });
    return response.data;
  },

  // Direct Permissions
  assignPermissionToUser: async (empId: number, permissionName: string) => {
    const response = await API.post(API_URLS.EMPLOYEES.ASSIGN_PERMISSION(empId), { permission: permissionName });
    return response.data;
  },
  revokePermissionFromUser: async (empId: number, permissionName: string) => {
    const response = await API.post(API_URLS.EMPLOYEES.REVOKE_PERMISSION(empId), { permission: permissionName });
    return response.data;
  },
};