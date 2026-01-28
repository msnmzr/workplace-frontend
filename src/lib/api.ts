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
        <div style="font-size: 48px; margin-bottom: 20px;">⏱️</div>
        <h2 style="font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; font-family: inherit;">Session Expired</h2>
        <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 24px; font-family: inherit;">
            Your session has timed out for security. Redirecting you to the sign-in page...
        </p>
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
