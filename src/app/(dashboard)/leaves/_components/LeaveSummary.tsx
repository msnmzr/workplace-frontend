"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface LeaveCardProps {
    label: string;
    available: number;
    total: number;
    color: string;
}

const LeaveCard: React.FC<LeaveCardProps> = ({ label, available, total, color }) => {
    const percentage = total > 0 ? (available / total) * 100 : 0;

    const chartOptions: ApexOptions = {
        chart: {
            type: "radialBar",
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: "50%",
                },
                track: {
                    background: "#E5E7EB",
                    strokeWidth: "100%",
                },
                dataLabels: {
                    show: false
                }
            }
        },
        colors: [color],
        stroke: {
            lineCap: "round",
        },
    };

    return (
        <div className="flex items-center justify-between rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div>
                <h4 className="text-2xl font-bold text-dark dark:text-white leading-none">
                    {available}
                </h4>
                <p className="mt-1 text-sm font-semibold text-bodydark2 uppercase tracking-wide">
                    {label}
                </p>
                <div className="mt-3 flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${available > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500'}`}>
                        {available} / {total}
                    </span>
                    <span className="text-[11px] text-gray-500 italic">Remaining</span>
                </div>
            </div>

            <div className="h-18 translate-x-2">
                <Chart
                    options={chartOptions}
                    series={[percentage]}
                    type="radialBar"
                    height={90}
                    width={90}
                />
            </div>
        </div>
    );
};

interface LeaveSummaryProps {
    casualAvailable: number;
    casualTotal: number;
    annualAvailable: number;
    annualTotal: number;
    hajjAvailable: number;
    hajjTotal: number;
}

const LeaveSummary: React.FC<LeaveSummaryProps> = ({
    casualAvailable,
    casualTotal,
    annualAvailable,
    annualTotal,
    hajjAvailable,
    hajjTotal
}) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <LeaveCard
                label="Annual Leave"
                available={annualAvailable}
                total={annualTotal}
                color="#10B981"
            />
            <LeaveCard
                label="Casual + Sick"
                available={casualAvailable}
                total={casualTotal}
                color="#FACC15"
            />
            <LeaveCard
                label="Hajj Leave"
                available={hajjAvailable}
                total={hajjTotal}
                color="#3B82F6"
            />
        </div>
    );
};

export default LeaveSummary;
