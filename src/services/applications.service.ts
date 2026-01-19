import API from "@/lib/api";

export interface Application {
    id: number;
    name: string;
    slug: string;
    url: string;
    icon: string | null;
    icon_file?: File | null;
    description: string | null;
    active: boolean;
    created_at?: string;
    updated_at?: string;
}

export const ApplicationsService = {
    getApplications: async () => {
        const response = await API.get("/applications");
        const data = response.data?.data || response.data;
        return Array.isArray(data) ? data : [];
    },

    createApplication: async (data: FormData | Partial<Application>) => {
        const response = await API.post("/applications", data, {
            headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
        });
        return response.data;
    },

    getApplication: async (id: number) => {
        const response = await API.get(`/applications/${id}`);
        return response.data?.data || response.data;
    },

    updateApplication: async (id: number, data: FormData | Partial<Application>) => {
        // Many backends (like Laravel) don't support PUT/PATCH with multipart/form-data directly.
        // We often use POST with _method=PUT. Let's handle it if it's FormData.
        let method = "PUT";
        let payload = data;

        if (data instanceof FormData) {
            // Check if _method is already there, if not add it and use POST
            if (!data.has("_method")) {
                data.append("_method", "PUT");
            }
            method = "POST";
        }

        const response = await API({
            method: method,
            url: `/applications/${id}`,
            data: payload,
            headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
        });
        return response.data;
    },

    deleteApplication: async (id: number) => {
        const response = await API.delete(`/applications/${id}`);
        return response.data;
    },
};
