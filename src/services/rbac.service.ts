import API from "@/lib/api";
import { Permission, Role, User } from "@/types/rbac";

export const RbacService = {
  // --- Permissions ---
  // --- Permissions ---
  getPermissions: async () => {
    const response = await API.get<any>("/permissions");
    // Handle both wrapped { data: [...] } and unwrapped [...] responses
    const data = response.data?.data || response.data;
    return Array.isArray(data) ? data : [];
  },
  createPermission: async (data: { name: string }) => {
    const response = await API.post("/permissions", data);
    return response.data;
  },
  updatePermission: async (id: number, data: { name: string }) => {
    const response = await API.put(`/permissions/${id}`, data);
    return response.data;
  },
  deletePermission: async (id: number) => {
    const response = await API.delete(`/permissions/${id}`);
    return response.data;
  },

  // --- Roles ---
  getRoles: async () => {
    const response = await API.get<any>("/roles");
    const data = response.data?.data || response.data;
    return Array.isArray(data) ? data : [];
  },
  getRole: async (id: number) => {
    const response = await API.get<{ data: Role }>(`/roles/${id}`);
    return response.data.data;
  },
  createRole: async (data: { name: string; permissions?: number[] }) => {
    const response = await API.post("/roles", data);
    return response.data;
  },
  updateRole: async (id: number, data: { name: string; permissions?: number[] }) => {
    const response = await API.put(`/roles/${id}`, data);
    return response.data;
  },
  deleteRole: async (id: number) => {
    const response = await API.delete(`/roles/${id}`);
    return response.data;
  },

  // --- User Roles & Permissions ---
  getEmployeeRoles: async (empId: number) => {
    const response = await API.get(`/employees/${empId}/roles`);
    
    // Handle { roles: [...] } format
    if (response.data?.roles) {
       return Array.isArray(response.data.roles) ? response.data.roles : [];
    }
    
    const data = response.data?.data || response.data;
    return Array.isArray(data) ? data : [];
  },
  assignRoleToUser: async (empId: number, roleId: number) => {
    const response = await API.post(`/employees/${empId}/assign-role`, { roles: [roleId] });
    return response.data;
  },
  removeRoleFromUser: async (empId: number, roleId: number) => {
    const response = await API.post(`/employees/${empId}/remove-role`, { roles: [roleId] });
    return response.data;
  },
  syncUserRoles: async (empId: number, roles: string[]) => {
    const response = await API.post(`/employees/${empId}/sync-roles`, { roles });
    return response.data;
  },
  
  // Direct Permissions
  assignPermissionToUser: async (empId: number, permissionName: string) => {
    const response = await API.post(`/employees/${empId}/assign-permission`, { permission: permissionName });
    return response.data;
  },
  revokePermissionFromUser: async (empId: number, permissionName: string) => {
    const response = await API.post(`/employees/${empId}/revoke-permission`, { permission: permissionName });
    return response.data;
  },
};