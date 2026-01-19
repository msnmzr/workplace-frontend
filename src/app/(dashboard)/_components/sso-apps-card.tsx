"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Application, ApplicationsService } from "@/services/applications.service";
import { getAssetUrl } from "@/lib/utils";
import { AuthService } from "@/services/auth.service";

export function SSOAppsCard() {
    const [apps, setApps] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const data = await ApplicationsService.getApplications();
                // Filter only active apps that the user has access to
                const accessibleApps = data.filter(app =>
                    app.active && AuthService.canAccessApplication(app)
                );
                setApps(accessibleApps);
            } catch (error) {
                console.error("Failed to fetch SSO applications:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchApps();
    }, []);

    return (
        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-6">
            <h3 className="mb-4 text-xl font-bold text-dark dark:text-primary">
                Applications
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
                {isLoading ? (
                    // Simple Loading Skeleton
                    Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={`loading-${i}`}
                            className="flex flex-col items-center justify-center rounded-lg border border-stroke bg-gray-2 p-4 animate-pulse dark:border-dark-3 dark:bg-dark-2"
                        >
                            <div className="mb-2 h-12 w-12 rounded-full bg-gray-200 dark:bg-dark-3"></div>
                            <div className="h-4 w-20 rounded bg-gray-200 dark:bg-dark-3"></div>
                        </div>
                    ))
                ) : (
                    apps.map((app) => (
                        <Link
                            key={app.id}
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col items-center justify-center rounded-lg border border-stroke bg-gray-2 p-4 transition hover:border-primary hover:bg-primary/5 dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary"
                        >
                            <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-dark-3 group-hover:bg-primary/20">
                                <img
                                    src={getAssetUrl(app.icon)}
                                    alt={app.name}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-center text-sm font-medium text-dark group-hover:text-primary dark:text-primary truncate w-full">
                                {app.name}
                            </span>
                        </Link>
                    ))
                )}

                {!isLoading && apps.length === 0 && (
                    <div className="col-span-full py-4 text-center text-gray-500 italic">
                        No applications available.
                    </div>
                )}
            </div>
        </div>
    );
}
