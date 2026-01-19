import React from "react";
import { SearchIcon } from "@/assets/icons"; // Assuming you have an icon, otherwise I'll use text or a simple SVG

interface DataTableControlsProps {
  onSearch: (value: string) => void;
  onPerPageChange: (value: number) => void;
  perPageOptions?: number[];
  searchValue: string;
  perPage: number;
}

const DataTableControls: React.FC<DataTableControlsProps> = ({
  onSearch,
  onPerPageChange,
  perPageOptions = [10, 25, 50, 100],
  searchValue,
  perPage,
}) => {
  return (
    <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-black dark:text-primary">Show</span>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="dark:border-form-primary dark:bg-form-input-primary dark:border-primary dark:text-primary rounded border border-stroke bg-transparent px-2 py-1 outline-none transition focus:border-primary active:border-primary"
        >
          {perPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="text-sm text-black dark:text-primary">entries</span>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
          className="dark:border-form-primary dark:bg-form-input-primary dark:border-primary dark:text-primary w-full rounded border border-stroke bg-transparent py-2 pl-4 pr-10 outline-none transition focus:border-primary active:border-primary sm:w-64"
        />
        {/* Simple Search Icon if available, or simplified here */}
        <span className="absolute right-4 top-1/2 -translate-y-1/2">
          <svg
            className="fill-body dark:fill-bodydark hover:fill-primary dark:hover:fill-primary"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
              fill=""
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
              fill=""
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default DataTableControls;
