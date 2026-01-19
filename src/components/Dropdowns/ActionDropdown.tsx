import { useEffect, useRef, useState } from "react";

interface ActionItem {
    label: string;
    onClick: () => void;
    variant?: "default" | "danger";
}

interface ActionDropdownProps {
    actions: ActionItem[];
}

const ActionDropdown = ({ actions }: ActionDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2.5 rounded-[7px] px-2 py-[2px] text-xs font-medium bg-[rgba(87,80,241,0.07)] border border-[rgba(87,80,241,0.1)] text-dark-4 hover:text-dark hover:bg-opacity-95 dark:text-primary dark:bg-[#FFFFFF1A] dark:border dark:border-primary dark:hover:text-dark-7"
                aria-expanded={isOpen}
                aria-haspopup="menu"
                data-state={isOpen ? "open" : "closed"}
            >
                <span>Actions</span>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 22 22"
                    fill="currentColor"
                    className={`size-5 transition-transform ${isOpen ? "rotate-0" : "rotate-180"}`}
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.551 7.728a.687.687 0 01.895 0l6.417 5.5a.687.687 0 11-.895 1.044l-5.97-5.117-5.969 5.117a.687.687 0 01-.894-1.044l6.416-5.5z"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-40 mt-2 w-48 rounded bg-white shadow-card dark:bg-boxdark dark:shadow-card-dark">
                    <ul className="flex flex-col">
                        {actions.map((action, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => {
                                        action.onClick();
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm bg-[rgba(87,80,241,0.07)] hover:bg-primary/10 dark:hover:bg-primary/10 ${action.variant === "danger"
                                        ? "text-red-500"
                                        : "text-dark-4 hover:text-dark"
                                        }`}
                                >
                                    {action.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ActionDropdown;
