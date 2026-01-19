import React from "react";

interface DataTableInfoProps {
  totalEntries: number;
  currentPage: number;
  perPage: number;
}

const DataTableInfo: React.FC<DataTableInfoProps> = ({
  totalEntries,
  currentPage,
  perPage,
}) => {
  const start = totalEntries === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalEntries);

  return (
    <div className="p-4 text-sm text-black dark:text-primary">
      Showing {start} to {end} of {totalEntries} entries
    </div>
  );
};

export default DataTableInfo;
