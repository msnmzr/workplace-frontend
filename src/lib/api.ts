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

const showSessionExpiredNotification = () => {
    if (typeof window === "undefined") return;

    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "session-expired-overlay";
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
        z-index: 9999999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    `;

    // Create modal
    const modal = document.createElement("div");
    modal.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 16px;
        text-align: center;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        max-width: 400px;
        width: 90%;
        transform: translateY(20px);
        transition: transform 0.3s ease-out;
    `;

    modal.innerHTML = `
        <div style="font-size: 56px; display: inline-block; margin-bottom: 10px;">
            <svg width="50" height="51" viewBox="0 0 50 51" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M24.9993 6.26758C14.3564 6.26758 5.72852 14.8954 5.72852 25.5384C5.72852 36.1814 14.3564 44.8092 24.9993 44.8092C35.6423 44.8092 44.2702 36.1814 44.2702 25.5384C44.2702 14.8954 35.6423 6.26758 24.9993 6.26758ZM2.60352 25.5384C2.60352 13.1695 12.6305 3.14258 24.9993 3.14258C37.3682 3.14258 47.3952 13.1695 47.3952 25.5384C47.3952 37.9073 37.3682 47.9342 24.9993 47.9342C12.6305 47.9342 2.60352 37.9073 2.60352 25.5384ZM17.8189 34.6998C19.8448 33.1982 22.3223 32.3092 24.9993 32.3092C27.6764 32.3092 30.1539 33.1982 32.1798 34.6998C32.8731 35.2137 33.0185 36.1923 32.5046 36.8855C31.9907 37.5788 31.0122 37.7242 30.3189 37.2103C28.8015 36.0856 26.97 35.4342 24.9993 35.4342C23.0287 35.4342 21.1972 36.0856 19.6798 37.2103C18.9865 37.7242 18.008 37.5788 17.4941 36.8855C16.9802 36.1923 17.1256 35.2137 17.8189 34.6998Z" fill=""></path><path d="M33.3327 22.4134C33.3327 24.1393 32.3999 25.5384 31.2493 25.5384C30.0988 25.5384 29.166 24.1393 29.166 22.4134C29.166 20.6875 30.0988 19.2884 31.2493 19.2884C32.3999 19.2884 33.3327 20.6875 33.3327 22.4134Z" fill=""></path><path d="M20.8327 22.4134C20.8327 24.1393 19.8999 25.5384 18.7493 25.5384C17.5988 25.5384 16.666 24.1393 16.666 22.4134C16.666 20.6875 17.5988 19.2884 18.7493 19.2884C19.8999 19.2884 20.8327 20.6875 20.8327 22.4134Z" fill=""></path></svg>
        </div>
        <h2 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; font-family: inherit;">Session Expired</h2>
        
        <h4 style="font-weight: 700; color: #1a1a1a; margin-bottom: 12px; font-family: inherit;">Redirecting to <a href="/login" style="color: #3c50e0;">
            Login Page
            <svg style="display: inline;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
        </a></h4>
        
        <div style="width: 40px; height: 40px; margin: 0 auto; border: 3px solid #f3f3f3; border-top: 3px solid #3c50e0; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Fade in
    requestAnimationFrame(() => {
        overlay.style.opacity = "1";
        modal.style.transform = "translateY(0)";
    });
};

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log("[API Interceptor] 401 Detected. Showing notification...");
            // Show notification
            showSessionExpiredNotification();

            // Clear all auth data
            Cookies.remove("auth_token");
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("auth_user");

                // Delay redirect to allow user to see the message
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2500);
            }
        }
        return Promise.reject(error);
    }
);

export default API;
