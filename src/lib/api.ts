import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

API.interceptors.request.use(config => {
    const token = Cookies.get("auth_token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

export default API;
