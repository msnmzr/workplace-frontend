import Link from "next/link";

interface Item {
    title: string;
    date: string;
    link?: string;
    meta?: string;
}

interface WidgetProps {
    title: string;
    items: Item[];
    viewAllLink?: string;
}

export function InfoWidget({ title, items, viewAllLink = "#" }: WidgetProps) {
    return (
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-6">
                <h3 className="text-xl font-bold text-dark dark:text-primary">{title}</h3>
            </div>
            <div className="p-4 sm:p-6">
                <div className="flex flex-col gap-5">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                            <Link
                                href={item.link || "#"}
                                className="text-base font-medium text-sm text-dark hover:text-primary dark:text-primary dark:hover:text-primary"
                            >
                                {item.title}
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-body-sm text-gray-500 dark:text-gray-400">
                                <span>{item.date}</span>
                                {item.meta && (
                                    <>
                                        <span className="h-1 w-1 rounded-full bg-gray-500"></span>
                                        <span>{item.meta}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    <Link href={viewAllLink} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                        View All
                        <svg className="fill-current w-4 h-4" viewBox="0 0 20 20">
                            <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
