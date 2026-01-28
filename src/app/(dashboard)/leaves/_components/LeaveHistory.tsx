"use client";

import React from "react";

interface LeaveRecord {
    id: number;
    leaveCategory: string;
    fromDate: string;
    toDate: string;
    requestedDays: number;
    status: string;
    reason: string;
}

interface LeaveHistoryProps {
    records: LeaveRecord[];
    onApplyLeave: () => void;
}

const LeaveHistory: React.FC<LeaveHistoryProps> = ({ records, onApplyLeave }) => {
    return (
        <div className="rounded-[10px] border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:px-7.5">
            <div className="mb-6 flex items-center justify-between">
                <h4 className="text-xl font-bold text-dark dark:text-primary">
                    Leave History
                </h4>
                <button
                    onClick={onApplyLeave}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-dark text-sm hover:bg-opacity-90"
                >
                    Apply Leave
                </button>
            </div>

            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="px-4 py-4 font-medium text-dark dark:text-white xl:pl-11">
                                Category
                            </th>
                            <th className="px-4 py-4 font-medium text-dark dark:text-white">
                                Duration
                            </th>
                            <th className="px-4 py-4 font-medium text-dark dark:text-white text-center">
                                Days
                            </th>
                            <th className="px-4 py-4 font-medium text-dark dark:text-white">
                                Status
                            </th>
                            <th className="px-4 py-4 font-medium text-dark dark:text-white">
                                Reason
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-500">
                                    No leave records found.
                                </td>
                            </tr>
                        ) : (
                            records.map((record) => (
                                <tr key={record.id} className="border-b border-stroke dark:border-dark-3">
                                    <td className="px-4 py-5 pl-9 xl:pl-11">
                                        <h5 className="font-medium text-dark dark:text-white">
                                            {record.leaveCategory}
                                        </h5>
                                    </td>
                                    <td className="px-4 py-5">
                                        <p className="text-dark dark:text-white text-sm">
                                            {record.fromDate} - {record.toDate}
                                        </p>
                                    </td>
                                    <td className="px-4 py-5 text-center">
                                        <p className="text-dark dark:text-white">
                                            {record.requestedDays}
                                        </p>
                                    </td>
                                    <td className="px-4 py-5">
                                        <span className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${record.status === "Approved" ? "bg-success text-success" :
                                            record.status === "Pending" ? "bg-warning text-warning" :
                                                "bg-danger text-danger"
                                            }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-5">
                                        <p className="text-dark dark:text-white text-sm line-clamp-1 max-w-[200px]" title={record.reason}>
                                            {record.reason}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveHistory;
