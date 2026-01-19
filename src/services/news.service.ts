import API from "@/lib/api";

export interface NewsItem {
    id: number;
    title: string;
    description: string | null;
    image: string | null;
    image_file?: File | null;
    is_featured: boolean;
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
}

export const NewsService = {
    getNews: async (params?: any) => {
        const response = await API.get("/news", { params });
        const data = response.data?.data || response.data;
        return Array.isArray(data) ? data : [];
    },

    getNewsItem: async (id: number) => {
        const response = await API.get(`/news/${id}`);
        return response.data?.data || response.data;
    },

    createNews: async (data: FormData | Partial<NewsItem>) => {
        const response = await API.post("/news", data, {
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
            url: `/news/${id}`,
            data: payload,
            headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
        });
        return response.data;
    },

    deleteNews: async (id: number) => {
        const response = await API.delete(`/news/${id}`);
        return response.data;
    },

    toggleFeatured: async (id: number) => {
        const response = await API.patch(`/news/${id}/toggle-featured`);
        return response.data;
    },

    togglePublished: async (id: number) => {
        const response = await API.patch(`/news/${id}/toggle-published`);
        return response.data;
    },
};
