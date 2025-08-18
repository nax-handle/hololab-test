"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/order";

// Mock revenue data for different time periods
const generateRevenueData = (period: string) => {
  const baseData = {
    "1D": [
      { time: "00:00", revenue: 1200 },
      { time: "04:00", revenue: 800 },
      { time: "08:00", revenue: 2100 },
      { time: "12:00", revenue: 3200 },
      { time: "16:00", revenue: 2800 },
      { time: "20:00", revenue: 1900 },
      { time: "24:00", revenue: 1400 },
    ],
    "7D": [
      { time: "Mon", revenue: 12000 },
      { time: "Tue", revenue: 15000 },
      { time: "Wed", revenue: 18000 },
      { time: "Thu", revenue: 22000 },
      { time: "Fri", revenue: 28000 },
      { time: "Sat", revenue: 25000 },
      { time: "Sun", revenue: 20000 },
    ],
    "1M": [
      { time: "Week 1", revenue: 85000 },
      { time: "Week 2", revenue: 92000 },
      { time: "Week 3", revenue: 78000 },
      { time: "Week 4", revenue: 105000 },
    ],
    "1Y": [
      { time: "Jan", revenue: 320000 },
      { time: "Feb", revenue: 280000 },
      { time: "Mar", revenue: 350000 },
      { time: "Apr", revenue: 420000 },
      { time: "May", revenue: 380000 },
      { time: "Jun", revenue: 450000 },
      { time: "Jul", revenue: 520000 },
      { time: "Aug", revenue: 480000 },
      { time: "Sep", revenue: 550000 },
      { time: "Oct", revenue: 620000 },
      { time: "Nov", revenue: 580000 },
      { time: "Dec", revenue: 650000 },
    ],
    ALL: [
      { time: "2021", revenue: 2800000 },
      { time: "2022", revenue: 3200000 },
      { time: "2023", revenue: 4100000 },
      { time: "2024", revenue: 5800000 },
      { time: "2025", revenue: 6500000 },
    ],
  };
  return baseData["7D"];
};

const timePeriods = [
  { label: "1D", value: "1D" },
  { label: "7D", value: "7D" },
  { label: "1M", value: "1M" },
  { label: "1Y", value: "1Y" },
  { label: "All", value: "ALL" },
];

export function RevenueChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("7D");
  const data = generateRevenueData(selectedPeriod);

  const currentRevenue = data[data.length - 1]?.revenue || 0;
  const previousRevenue = data[data.length - 2]?.revenue || 0;
  const growth =
    previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-bold">
                {formatCurrency(currentRevenue)}
              </span>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  growth >= 0
                    ? "text-green-600 bg-green-50"
                    : "text-red-600 bg-red-50"
                }`}
              >
                {growth >= 0 ? "+" : ""}
                {growth.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            {timePeriods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
                className="h-8 px-3"
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            revenue: {
              label: "Revenue",
              color: "hsl(142, 76%, 36%)",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="time"
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                className="text-xs"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => formatCurrency(value, true)}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  "Revenue",
                ]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "var(--color-revenue)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
