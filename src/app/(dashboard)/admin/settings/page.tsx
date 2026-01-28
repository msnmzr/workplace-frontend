"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState } from "react";
import BannersView from "./components/BannersView";
import PagesView from "./components/PagesView";
import MenusView from "./components/MenusView";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<"banners" | "pages" | "menus">(
        "banners"
    );

    return (
        <>
            <Breadcrumb pageName="Settings" />

            <div className="flex flex-col text-sm">

                {/* Tabs */}

                <div className="rounded-[10px] border border-stroke bg-white p-2 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveTab("banners")}
                            className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === "banners"
                                ? "bg-primary text-dark shadow-md"
                                : "text-body hover:bg-gray-2 dark:text-bodydark dark:hover:bg-meta-4"
                                }`}
                        >
                            Banners
                        </button>
                        <button
                            onClick={() => setActiveTab("pages")}
                            className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === "pages"
                                ? "bg-primary text-dark shadow-md"
                                : "text-body hover:bg-gray-2 dark:text-bodydark dark:hover:bg-meta-4"
                                }`}
                        >
                            Static Pages
                        </button>
                        <button
                            onClick={() => setActiveTab("menus")}
                            className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === "menus"
                                ? "bg-primary text-dark shadow-md"
                                : "text-body hover:bg-gray-2 dark:text-bodydark dark:hover:bg-meta-4"
                                }`}
                        >
                            Menu Items
                        </button>
                    </div>
                </div>

                {/* Content */}
                {activeTab === "banners" && <BannersView />}
                {activeTab === "pages" && <PagesView />}
                {activeTab === "menus" && <MenusView />}
            </div>
        </>
    );
}
