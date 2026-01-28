const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const API_URLS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/login`,
        REGISTER: `${API_BASE_URL}/register`,
        LOGOUT: `${API_BASE_URL}/logout`,
        ME: `${API_BASE_URL}/me`,
    },
    USERS: {
        LIST: `${API_BASE_URL}/users`,
        CREATE: `${API_BASE_URL}/users`,
        UPDATE: (id: number) => `${API_BASE_URL}/users/${id}`,
        DELETE: (id: number) => `${API_BASE_URL}/users/${id}`,
    },
    ROLES: {
        LIST: `${API_BASE_URL}/roles`,
        CREATE: `${API_BASE_URL}/roles`,
        DETAILS: (id: number) => `${API_BASE_URL}/roles/${id}`,
        UPDATE: (id: number) => `${API_BASE_URL}/roles/${id}`,
        DELETE: (id: number) => `${API_BASE_URL}/roles/${id}`,
    },
    PERMISSIONS: {
        LIST: `${API_BASE_URL}/permissions`,
        CREATE: `${API_BASE_URL}/permissions`,
        UPDATE: (id: number) => `${API_BASE_URL}/permissions/${id}`,
        DELETE: (id: number) => `${API_BASE_URL}/permissions/${id}`,
    },
    EMPLOYEES: {
        LIST: `${API_BASE_URL}/employees`,
        ROLES: (empId: number) => `${API_BASE_URL}/employees/${empId}/roles`,
        ASSIGN_ROLE: (empId: number) => `${API_BASE_URL}/employees/${empId}/assign-role`,
        REMOVE_ROLE: (empId: number) => `${API_BASE_URL}/employees/${empId}/remove-role`,
        SYNC_ROLES: (empId: number) => `${API_BASE_URL}/employees/${empId}/sync-roles`,
        ASSIGN_PERMISSION: (empId: number) => `${API_BASE_URL}/employees/${empId}/assign-permission`,
        REVOKE_PERMISSION: (empId: number) => `${API_BASE_URL}/employees/${empId}/revoke-permission`,
    },
    NEWS: {
        LIST: `${API_BASE_URL}/news`,
        CREATE: `${API_BASE_URL}/news`,
        DETAILS: (id: number) => `${API_BASE_URL}/news/${id}`,
        UPDATE: (id: number) => `${API_BASE_URL}/news/${id}`,
        DELETE: (id: number) => `${API_BASE_URL}/news/${id}`,
        TOGGLE_FEATURED: (id: number) => `${API_BASE_URL}/news/${id}/toggle-featured`,
        TOGGLE_PUBLISHED: (id: number) => `${API_BASE_URL}/news/${id}/toggle-published`,
    },
    NEWS_CATEGORIES: {
        LIST: `${API_BASE_URL}/news-categories`,
        CREATE: `${API_BASE_URL}/news-categories`,
        UPDATE: (id: number) => `${API_BASE_URL}/news-categories/${id}`,
        DELETE: (id: number) => `${API_BASE_URL}/news-categories/${id}`,
    },
    NEWS_PRIORITIES: {
        LIST: `${API_BASE_URL}/news-priorities`,
        CREATE: `${API_BASE_URL}/news-priorities`,
        UPDATE: (id: number) => `${API_BASE_URL}/news-priorities/${id}`,
        DELETE: (id: number) => `${API_BASE_URL}/news-priorities/${id}`,
    },
    NEWS_TAGS: {
        LIST: `${API_BASE_URL}/news-tags`,
        CREATE: `${API_BASE_URL}/news-tags`,
        UPDATE: (id: number) => `${API_BASE_URL}/news-tags/${id}`,
        DELETE: (id: number) => `${API_BASE_URL}/news-tags/${id}`,
    },
    APPLICATIONS: {
        LIST: `${API_BASE_URL}/applications`,
        CREATE: `${API_BASE_URL}/applications`,
        DETAILS: (id: number) => `${API_BASE_URL}/applications/${id}`,
        UPDATE: (id: number) => `${API_BASE_URL}/applications/${id}`,
        DELETE: (id: number) => `${API_BASE_URL}/applications/${id}`,
    },
    SETTINGS: {
        BANNERS: {
            LIST: `${API_BASE_URL}/settings/banners`,
            CREATE: `${API_BASE_URL}/settings/banners`,
            UPDATE: (id: number) => `${API_BASE_URL}/settings/banners/${id}`,
            DELETE: (id: number) => `${API_BASE_URL}/settings/banners/${id}`,
        },
        PAGES: {
            LIST: `${API_BASE_URL}/settings/pages`,
            CREATE: `${API_BASE_URL}/settings/pages`,
            UPDATE: (id: number) => `${API_BASE_URL}/settings/pages/${id}`,
            DELETE: (id: number) => `${API_BASE_URL}/settings/pages/${id}`,
        },
        MENUS: {
            LIST: `${API_BASE_URL}/settings/menus`,
            CREATE: `${API_BASE_URL}/settings/menus`,
            UPDATE: (id: number) => `${API_BASE_URL}/settings/menus/${id}`,
            DELETE: (id: number) => `${API_BASE_URL}/settings/menus/${id}`,
        }
    },
    LEAVES: {
        SUMMARY: (empNo: string) => `${process.env.NEXT_PUBLIC_LCS_API_URL}/LeaveManagement/getEmployeeRemainingLeaves?EmpNo=${empNo}`,
        HISTORY: (empNo: string) => `${process.env.NEXT_PUBLIC_LCS_API_URL}/LeaveManagement/getEmployeeLeaveHistory?EmpNo=${empNo}`,
        SUBMIT: `http://172.16.0.13/LCS_API/api/LeaveManagement/InsertLeave`,
    }
};
