"use client";

import React, { useState, useEffect } from "react";
import { LeavesService, LeaveRequest } from "@/services/leaves.service";

interface LeaveFormProps {
    isOpen: boolean;
    onClose: () => void;
    empNo: string;
    empName: string;
    availableCasual: number;
    onSubmitSuccess: () => void;
}

const LeaveForm: React.FC<LeaveFormProps> = ({
    isOpen,
    onClose,
    empNo,
    empName,
    availableCasual,
    onSubmitSuccess
}) => {
    const [formData, setFormData] = useState({
        empNo: empNo,
        empName: empName,
        leaveCategoryId: "",
        fromDate: "",
        toDate: "",
        requestedDays: 0,
        leaveTypeId: 1, // Default to Full Day (1)
        reason: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate days when dates change
    useEffect(() => {
        if (formData.fromDate && formData.toDate) {
            const start = new Date(formData.fromDate);
            const end = new Date(formData.toDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            setFormData(prev => ({ ...prev, requestedDays: diffDays > 0 ? diffDays : 0 }));
        }
    }, [formData.fromDate, formData.toDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload: LeaveRequest = {
            SubmitByEmpNo: formData.empNo,
            SubmitForEmpNo: formData.empNo,
            LeaveTypeName: "WorkPlace",
            LeaveTypeId: Number(formData.leaveTypeId),
            LeaveCategoryName: "WorkPlace",
            LeaveCategoryId: Number(formData.leaveCategoryId),
            LeaveFromDate: formData.fromDate,
            LeaveToDate: formData.toDate,
            NoOfLeaveDays: formData.requestedDays,
            LeaveReason: formData.reason,
            LeaveStatusName: "WorkPlace",
            LeaveStatusId: 1 // Assuming 1 is for "Pending"
        };

        try {
            await LeavesService.submitLeaveApplication(payload);
            alert("Leave application submitted successfully!");
            onSubmitSuccess();
            onClose(); // Close modal on success
            // Reset form
            setFormData({
                ...formData,
                leaveCategoryId: "",
                fromDate: "",
                toDate: "",
                requestedDays: 0,
                leaveTypeId: 1,
                reason: ""
            });
        } catch (error) {
            console.error("Failed to submit leave", error);
            alert("Failed to submit leave application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-999999 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 outline-none focus:outline-none p-4 text-sm">
            <div className="relative max-h-[95vh] w-full max-w-4xl">
                <div className="relative rounded-lg bg-white shadow-2 dark:bg-gray-dark overflow-hidden flex flex-col max-h-full">
                    {/* Modal Header */}
                    <div className="flex items-start justify-between rounded-t border-b p-5 pb-1 dark:border-dark-3">
                        <h3 className="text-xl font-bold tracking-wider text-dark dark:text-primary">
                            Leave Form Request
                        </h3>
                        <button
                            type="button"
                            className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-meta-4 dark:hover:text-white"
                            onClick={onClose}
                        >
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 overflow-y-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                                {/* Employee Code */}
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <label className="min-w-[150px] text-sm font-bold text-dark dark:text-primary">
                                        Emp Code:
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.empNo}
                                        readOnly
                                        className="w-full rounded-md border border-stroke bg-gray-2 py-2 px-4 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                    />
                                </div>

                                {/* Employee Name */}
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <label className="min-w-[150px] text-sm font-bold text-dark dark:text-primary">
                                        Emp Name:
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.empName}
                                        readOnly
                                        className="w-full rounded-md border border-stroke bg-gray-2 py-2 px-4 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                                    />
                                </div>

                                {/* Leave Category */}
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <label className="min-w-[150px] text-sm font-bold text-dark dark:text-primary">
                                        Category:
                                    </label>
                                    <select
                                        required
                                        value={formData.leaveCategoryId}
                                        onChange={(e) => setFormData({ ...formData, leaveCategoryId: e.target.value })}
                                        className="w-full rounded-md border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="1">Annual</option>
                                        <option value="2">Casual</option>
                                        <option value="3">Sick</option>
                                        <option value="4">Maternity</option>
                                        <option value="5">Hajj</option>
                                        <option value="6">Umrah</option>
                                    </select>
                                </div>

                                {/* Available Casual Leaves */}
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <label className="min-w-[150px] text-sm font-bold text-dark dark:text-primary">
                                        Avail Casual:
                                    </label>
                                    <input
                                        type="text"
                                        value={availableCasual}
                                        readOnly
                                        className="w-full rounded-md border border-stroke bg-gray-2 py-2 px-4 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
                                    />
                                </div>

                                {/* From Date */}
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <label className="min-w-[150px] text-sm font-bold text-dark dark:text-primary">
                                        From:
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.fromDate}
                                        onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                                        className="w-full rounded-md border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
                                    />
                                </div>

                                {/* To Date */}
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <label className="min-w-[150px] text-sm font-bold text-dark dark:text-primary">
                                        To:
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.toDate}
                                        onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                                        className="w-full rounded-md border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
                                    />
                                </div>

                                {/* Requested Days */}
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <label className="min-w-[150px] text-sm font-bold text-dark dark:text-primary">
                                        Days:
                                    </label>
                                    <input
                                        type="number"
                                        readOnly
                                        value={formData.requestedDays}
                                        className="w-full rounded-md border border-stroke bg-gray-2 py-2 px-4 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
                                    />
                                </div>

                                {/* Leave Type */}
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <label className="min-w-[150px] text-sm font-bold text-dark dark:text-primary">
                                        Type:
                                    </label>
                                    <select
                                        required
                                        value={formData.leaveTypeId}
                                        onChange={(e) => setFormData({ ...formData, leaveTypeId: Number(e.target.value) })}
                                        className="w-full rounded-md border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
                                    >
                                        <option value="1">Full Day</option>
                                        <option value="2">Half Day - First Half</option>
                                        <option value="3">Half Day - Second Half</option>
                                    </select>
                                </div>

                                {/* Reason - Full Width */}
                                <div className="md:col-span-2 flex flex-col md:flex-row gap-2">
                                    <label className="min-w-[150px] text-sm font-bold text-dark dark:text-primary pt-2">
                                        Reason:
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        className="w-full rounded-md border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-md bg-gray-2 px-8 py-2 font-bold text-dark hover:bg-opacity-90 dark:bg-meta-4 dark:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-md bg-primary px-12 py-2 font-bold text-dark shadow-md hover:bg-opacity-90 disabled:bg-opacity-50"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveForm;
