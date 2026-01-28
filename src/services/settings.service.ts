import { API_URLS } from "@/config/api-urls";
import { Banner, MenuItem, StaticPage } from "@/types/settings";

// Mock data
let BANNERS: Banner[] = [
    {
        id: 1,
        title: "Welcome Banner",
        image_url: "https://via.placeholder.com/800x200",
        link_url: "/dashboard",
        is_active: true,
        order: 1,
        description: "Main welcome banner for the dashboard"
    },
    {
        id: 2,
        title: "Maintenance Notice",
        image_url: "https://via.placeholder.com/800x200",
        link_url: "#",
        is_active: false,
        order: 2,
        description: "Scheduled maintenance on Sunday"
    }
];

let PAGES: StaticPage[] = [
    {
        id: 1,
        title: "About Us",
        slug: "about-us",
        content: "<p>Welcome to our company...</p>",
        is_published: true
    },
    {
        id: 2,
        title: "Privacy Policy",
        slug: "privacy-policy",
        content: "<p>Privacy policy content...</p>",
        is_published: true
    }
];

let MENUS: MenuItem[] = [
    {
        id: 1,
        label: "Home",
        url: "/",
        order: 1,
        is_active: true,
        parent_id: null
    },
    {
        id: 2,
        label: "Contact",
        url: "/contact",
        order: 2,
        is_active: true,
        parent_id: null
    }
];

// Helper to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const SettingsService = {
    // Banners
    getBanners: async (): Promise<Banner[]> => {
        await delay(500);
        return [...BANNERS];
    },

    createBanner: async (data: Omit<Banner, "id">): Promise<Banner> => {
        await delay(500);
        const newBanner = { ...data, id: Date.now() };
        BANNERS.push(newBanner);
        return newBanner;
    },

    updateBanner: async (id: number, data: Partial<Banner>): Promise<Banner> => {
        await delay(500);
        const index = BANNERS.findIndex(b => b.id === id);
        if (index === -1) throw new Error("Banner not found");
        BANNERS[index] = { ...BANNERS[index], ...data };
        return BANNERS[index];
    },

    deleteBanner: async (id: number): Promise<void> => {
        await delay(500);
        BANNERS = BANNERS.filter(b => b.id !== id);
    },

    // Pages
    getPages: async (): Promise<StaticPage[]> => {
        await delay(500);
        return [...PAGES];
    },

    createPage: async (data: Omit<StaticPage, "id">): Promise<StaticPage> => {
        await delay(500);
        const newPage = { ...data, id: Date.now() };
        PAGES.push(newPage);
        return newPage;
    },

    updatePage: async (id: number, data: Partial<StaticPage>): Promise<StaticPage> => {
        await delay(500);
        const index = PAGES.findIndex(p => p.id === id);
        if (index === -1) throw new Error("Page not found");
        PAGES[index] = { ...PAGES[index], ...data };
        return PAGES[index];
    },

    deletePage: async (id: number): Promise<void> => {
        await delay(500);
        PAGES = PAGES.filter(p => p.id !== id);
    },

    // Menus
    getMenus: async (): Promise<MenuItem[]> => {
        await delay(500);
        return [...MENUS];
    },

    createMenu: async (data: Omit<MenuItem, "id">): Promise<MenuItem> => {
        await delay(500);
        const newMenu = { ...data, id: Date.now() };
        MENUS.push(newMenu);
        return newMenu;
    },

    updateMenu: async (id: number, data: Partial<MenuItem>): Promise<MenuItem> => {
        await delay(500);
        const index = MENUS.findIndex(m => m.id === id);
        if (index === -1) throw new Error("Menu item not found");
        MENUS[index] = { ...MENUS[index], ...data };
        return MENUS[index];
    },

    deleteMenu: async (id: number): Promise<void> => {
        await delay(500);
        MENUS = MENUS.filter(m => m.id !== id);
    }
};
