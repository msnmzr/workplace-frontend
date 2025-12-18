import type { PropsWithChildren } from "react";

// This layout will apply to all routes under the (auth) group (e.g., /login, /register)
export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        // Simple layout to center the login form, without any sidebar/header
        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}