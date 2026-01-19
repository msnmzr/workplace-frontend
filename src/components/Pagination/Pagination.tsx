import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = [];
  // Logic to show a window of pages, e.g., current-2 to current+2
  // For simplicity starting with basic range or all if small.
  // Given 212 pages, we definitely need a window.

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      );
    }
  }

  return (
    <div className="flex items-center justify-center p-4">
      <nav aria-label="Pagination">
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`ml-0 block rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-primary dark:hover:bg-gray-700 dark:hover:text-primary ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
            >
              <span className="sr-only">Previous</span>
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </li>

          {pages.map((page, index) => (
            <li key={index}>
              {page === "..." ? (
                <span className="border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-primary">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`border border-gray-300 px-3 py-2 leading-tight hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-primary ${currentPage === page
                    ? "z-10 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:text-primary"
                    : "bg-white text-gray-500 dark:bg-gray-800 dark:text-primary"
                    }`}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          <li>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`block rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-primary dark:hover:bg-gray-700 dark:hover:text-primary ${currentPage === totalPages
                ? "cursor-not-allowed opacity-50"
                : ""
                }`}
            >
              <span className="sr-only">Next</span>
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
