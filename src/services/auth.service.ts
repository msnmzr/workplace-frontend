export interface StoredUser {
    name: string;
    email: string;
    img: string | null;
    roles: any[];
    permissions: any[];
    applications?: any[];
    [key: string]: any;
}

export const AuthService = {
    getUser: (): StoredUser | null => {
        if (typeof window === "undefined") return null;
        try {
            const stored = localStorage.getItem("auth_user");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    },

    isSuperAdmin: (): boolean => {
        const user = AuthService.getUser();
        if (!user) return false;

        // Super admin usually has 'admin' or 'super-admin' role
        // or a specific permission like 'all-access'
        const hasAdminRole = user.roles?.some((role: any) => {
            const roleName = typeof role === 'string' ? role : (role.name || "");
            const lower = roleName.toLowerCase();
            return lower === "admin" || lower === "super admin" || lower === "super-admin" || lower === "super_admin";
        });

        const hasAdminPermission = user.permissions?.some((p: any) => {
            const pName = typeof p === 'string' ? p : (p.name || "");
            return pName === "all-access" || pName === "*";
        });

        return hasAdminRole || hasAdminPermission;
    },

    hasPermission: (permission: string): boolean => {
        if (AuthService.isSuperAdmin()) return true;
        const user = AuthService.getUser();
        if (!user) return false;

        return user.permissions?.some((p: any) => {
            const pName = typeof p === 'string' ? p : (p.name || "");
            return pName === permission;
        });
    },

    /**
     * Checks if the user has access to a specific application.
     * Logic: 
     * 1. Super Admin has access to all.
     * 2. If user object has an 'applications' array, check if the app's ID or slug matches.
     * 3. If not, check if there's a permission like 'access_app_{slug}'.
     */
    canAccessApplication: (app: { id: number; slug: string }): boolean => {
        if (AuthService.isSuperAdmin()) return true;
        const user = AuthService.getUser();
        if (!user) return false;

        // Check if applications list is provided in user object
        if (user.applications && Array.isArray(user.applications)) {
            return user.applications.some((a: any) =>
                a.id === app.id || a.slug === app.slug
            );
        }

        // Check for specific permission
        return AuthService.hasPermission(`access_${app.slug}`);
    }
};
