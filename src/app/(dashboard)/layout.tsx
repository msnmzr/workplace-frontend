import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import type { PropsWithChildren } from "react";

// This layout will apply to all routes under the (dashboard) group (e.g., /, /settings)
export default function DashboardLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            {/* NOTE: These components were moved from app/layout.tsx 
        and now only render on dashboard pages.
      */}

            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
                <Header />

                <main className="mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}