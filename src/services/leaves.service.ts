import API from "@/lib/api";
import { API_URLS } from "@/config/api-urls";

export interface LeaveSummaryData {
    Remaining_Annual: number;
    Remaining_Casual: number;
    Remaining_Maternity: number;
    Other: number;
    Avail_Annual: number;
    Avail_Casual: number;
    Avail_Sick: number;
    Avail_Maternity: number;
    Avail_Hajj: number;
    Avail_Umrah: number;
    Total_Annual: number;
    Total_Casual: number;
    Total_Sick: number;
    Total_Maternity: number;
    Total_Hajj: number;
    Total_Umrah: number;
}

export interface LeaveRequest {
    SubmitByEmpNo: string;
    SubmitForEmpNo: string;
    LeaveTypeName: string;
    LeaveTypeId: number;
    LeaveCategoryName: string;
    LeaveCategoryId: number;
    LeaveFromDate: string;
    LeaveToDate: string;
    NoOfLeaveDays: number;
    LeaveReason: string;
    LeaveStatusName: string;
    LeaveStatusId: number;
}

export const LeavesService = {
    getRemainingLeaves: async (empNo: string): Promise<LeaveSummaryData> => {
        const response = await API.get(API_URLS.LEAVES.SUMMARY(empNo));
        return response.data.Data;
    },

    submitLeaveApplication: async (data: LeaveRequest) => {
        const response = await API.post(API_URLS.LEAVES.SUBMIT, data);
        return response.data;
    },

    getLeaveHistory: async (empNo: string) => {
        const response = await API.get(API_URLS.LEAVES.HISTORY(empNo));
        return response.data.Data || [];
    }
};
