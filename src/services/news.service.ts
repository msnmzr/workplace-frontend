import API from "@/lib/api";
import { API_URLS } from "@/config/api-urls";

export interface NewsCategory {
    id: number;
    name: string;
}

export interface NewsPriority {
    id: number;
    name: string;
    level?: string; // e.g. Normal, Urgent
}

export interface NewsTag {
    id: number;
    name: string;
}

export interface NewsItem {
    id: number;
    title: string;
    content?: string;
    description: string | null;
    image: string | null;
    image_file?: File | null;
    attachment?: string;
    attachment_file?: File | null;
    category_id: number;
    priority_id: number;
    category?: NewsCategory;
    priority?: NewsPriority;
    tags?: NewsTag[];
    tags_ids?: number[]; // For form submission
    is_featured: boolean;
    is_published: boolean;
    expires_at?: string;
    created_at?: string;
    updated_at?: string;
}

export const NewsService = {
    getNews: async (params?: any) => {
        const response = await API.get(API_URLS.NEWS.LIST, { params });
        const data = response.data?.data || response.data;
        return Array.isArray(data) ? data : [];
    },

    getNewsItem: async (id: number) => {
        const response = await API.get(API_URLS.NEWS.DETAILS(id));
        return response.data?.data || response.data;
    },

    createNews: async (data: FormData | Partial<NewsItem>) => {
        const response = await API.post(API_URLS.NEWS.CREATE, data, {
            headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
        });
        return response.data;
    },

    updateNews: async (id: number, data: FormData | Partial<NewsItem>) => {
        let method = "PUT";
        let payload = data;

        if (data instanceof FormData) {
            if (!data.has("_method")) {
                data.append("_method", "PUT");
            }
            method = "POST";
        }

        const response = await API({
            method: method,
            url: API_URLS.NEWS.UPDATE(id),
            data: payload,
            headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
        });
        return response.data;
    },

    deleteNews: async (id: number) => {
        const response = await API.delete(API_URLS.NEWS.DELETE(id));
        return response.data;
    },

    toggleFeatured: async (id: number) => {
        const response = await API.patch(API_URLS.NEWS.TOGGLE_FEATURED(id));
        return response.data;
    },

    togglePublished: async (id: number) => {
        const response = await API.patch(API_URLS.NEWS.TOGGLE_PUBLISHED(id));
        return response.data;
    },

    // Categories
    getCategories: async () => {
        const response = await API.get(API_URLS.NEWS_CATEGORIES.LIST);
        return response.data?.data || response.data;
    },
    createCategory: async (data: Partial<NewsCategory>) => {
        const response = await API.post(API_URLS.NEWS_CATEGORIES.CREATE, data);
        return response.data;
    },
    updateCategory: async (id: number, data: Partial<NewsCategory>) => {
        const response = await API.put(API_URLS.NEWS_CATEGORIES.UPDATE(id), data);
        return response.data;
    },
    deleteCategory: async (id: number) => {
        const response = await API.delete(API_URLS.NEWS_CATEGORIES.DELETE(id));
        return response.data;
    },

    // Priorities
    getPriorities: async () => {
        const response = await API.get(API_URLS.NEWS_PRIORITIES.LIST);
        return response.data?.data || response.data;
    },
    createPriority: async (data: Partial<NewsPriority>) => {
        const response = await API.post(API_URLS.NEWS_PRIORITIES.CREATE, data);
        return response.data;
    },
    updatePriority: async (id: number, data: Partial<NewsPriority>) => {
        const response = await API.put(API_URLS.NEWS_PRIORITIES.UPDATE(id), data);
        return response.data;
    },
    deletePriority: async (id: number) => {
        const response = await API.delete(API_URLS.NEWS_PRIORITIES.DELETE(id));
        return response.data;
    },

    // Tags
    getTags: async () => {
        const response = await API.get(API_URLS.NEWS_TAGS.LIST);
        return response.data?.data || response.data;
    },
    createTag: async (data: Partial<NewsTag>) => {
        const response = await API.post(API_URLS.NEWS_TAGS.CREATE, data);
        return response.data;
    },
    updateTag: async (id: number, data: Partial<NewsTag>) => {
        const response = await API.put(API_URLS.NEWS_TAGS.UPDATE(id), data);
        return response.data;
    },
    deleteTag: async (id: number) => {
        const response = await API.delete(API_URLS.NEWS_TAGS.DELETE(id));
        return response.data;
    },
};
