"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState } from "react";
import NewsList from "./_components/NewsList";
import CategoryManager from "./_components/CategoryManager";
import PriorityManager from "./_components/PriorityManager";
import TagManager from "./_components/TagManager";

export default function NewsPage() {
    const [activeTab, setActiveTab] = useState("news");

    return (
        <>
            <Breadcrumb pageName="News Management" />

            <div className="flex flex-col text-sm">

                {/* Tabs */}
                <div className="rounded-[10px] border border-stroke bg-white p-2 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveTab("news")}
                            className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === "news"
                                ? "bg-primary text-dark shadow-md"
                                : "text-body hover:bg-gray-2 dark:text-bodydark dark:hover:bg-meta-4"
                                }`}
                        >
                            News Items
                        </button>
                        <button
                            onClick={() => setActiveTab("categories")}
                            className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === "categories"
                                ? "bg-primary text-dark shadow-md"
                                : "text-body hover:bg-gray-2 dark:text-bodydark dark:hover:bg-meta-4"
                                }`}
                        >
                            Categories
                        </button>
                        <button
                            onClick={() => setActiveTab("priorities")}
                            className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === "priorities"
                                ? "bg-primary text-dark shadow-md"
                                : "text-body hover:bg-gray-2 dark:text-bodydark dark:hover:bg-meta-4"
                                }`}
                        >
                            Priorities
                        </button>
                        <button
                            onClick={() => setActiveTab("tags")}
                            className={`px-4 py-2 rounded-md font-medium transition-all ${activeTab === "tags"
                                ? "bg-primary text-dark shadow-md"
                                : "text-body hover:bg-gray-2 dark:text-bodydark dark:hover:bg-meta-4"
                                }`}
                        >
                            Tags
                        </button>
                    </div>
                </div>

                {/* Content */}
                {activeTab === "news" && <NewsList />}
                {activeTab === "categories" && <CategoryManager />}
                {activeTab === "priorities" && <PriorityManager />}
                {activeTab === "tags" && <TagManager />}
            </div>
        </>
    );
}
