import { useState, useMemo } from "react";

interface Config<T> {
  data: T[];
  initialPerPage?: number;
  searchKeys?: (keyof T)[]; // Keys to search within
}

export function useClientTable<T>({
  data,
  initialPerPage = 10,
  searchKeys = [],
}: Config<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    let result = data;

    // Search
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter((item) =>
        searchKeys.some((key) => {
          const val = item[key];
          return String(val).toLowerCase().includes(lowerSearch);
        })
      );
    }

    return result;
  }, [data, search, searchKeys]);

  const totalPages = Math.ceil(filteredData.length / perPage) || 1;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredData.slice(start, start + perPage);
  }, [filteredData, currentPage, perPage]);

  // Reset page when filter changes
  useMemo(() => {
     if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const handleSearch = (val: string) => {
      setSearch(val);
      setCurrentPage(1);
  };

  return {
    currentPage,
    setCurrentPage,
    perPage,
    setPerPage,
    search,
    setSearch: handleSearch,
    data: paginatedData,
    totalEntries: filteredData.length,
    totalPages,
    allData: filteredData, // Return filtered but unpaginated if needed
  };
}
