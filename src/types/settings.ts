export interface Banner {
    id: number;
    title: string;
    image_url: string;
    link_url?: string;
    description?: string;
    is_active: boolean;
    order: number;
    created_at?: string;
    updated_at?: string;
}

export interface StaticPage {
    id: number;
    title: string;
    slug: string;
    content: string;
    is_published: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface MenuItem {
    id: number;
    label: string;
    url: string;
    parent_id?: number | null;
    order: number;
    is_active: boolean;
    children?: MenuItem[];
    created_at?: string;
    updated_at?: string;
}
