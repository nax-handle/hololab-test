"use client";

import { useState, useMemo } from "react";
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
import { formatCurrency, mapChartData } from "@/lib/order";
import { useGetOrderChart } from "@/hooks/use-order";
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  startOfYear,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  endOfYear,
} from "date-fns";
import { ChartRange } from "@/types";

function getDateRangeForPeriod(period: ChartRange) {
  const now = new Date();
  const today = startOfDay(now);

  switch (period) {
    case "1d":
      return {
        fromDate: format(today, "yyyy-MM-dd"),
        toDate: format(endOfDay(now), "yyyy-MM-dd"),
      };
    case "7d":
      return {
        fromDate: format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
        toDate: format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
      };
    case "1m":
      return {
        fromDate: format(startOfMonth(now), "yyyy-MM-dd"),
        toDate: format(endOfMonth(now), "yyyy-MM-dd"),
      };
    case "1y":
      return {
        fromDate: format(startOfYear(now), "yyyy-MM-dd"),
        toDate: format(endOfYear(now), "yyyy-MM-dd"),
      };
    case "all":
      return {
        fromDate: undefined,
        toDate: undefined,
      };
    default:
      return {
        fromDate: format(subDays(today, 6), "yyyy-MM-dd"),
        toDate: format(endOfDay(now), "yyyy-MM-dd"),
      };
  }
}

const timePeriods = [
  { label: "1D", value: "1d" as ChartRange },
  { label: "7D", value: "7d" as ChartRange },
  { label: "1M", value: "1m" as ChartRange },
  { label: "1Y", value: "1y" as ChartRange },
  { label: "All", value: "all" as ChartRange },
];

export function RevenueChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<ChartRange>("7d");

  // const dateRange = useMemo(
  //   () => getDateRangeForPeriod(selectedPeriod),
  //   [selectedPeriod]
  // );

  const {
    data: chartResponse,
    isLoading,
    error,
  } = useGetOrderChart({
    range: selectedPeriod,
  });

  const data = useMemo(() => {
    if (!chartResponse?.data?.[0]?.result) {
      return [];
    }

    const rawData = chartResponse.data[0].result;

    if (selectedPeriod === "all") {
      const currentYear = new Date().getFullYear();
      const years = rawData.map(
        (_, index) => `${currentYear - rawData.length + 1 + index}`
      );
      return rawData.map((point, index) => ({
        time: years[index] || `Year ${index + 1}`,
        revenue: point.revenue,
      }));
    }

    return mapChartData(rawData, selectedPeriod);
  }, [chartResponse, selectedPeriod]);

  const currentRevenue = data[data.length - 1]?.revenue || 0;
  const previousRevenue = data[data.length - 2]?.revenue || 0;
  const growth =
    previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

  if (error) {
    return (
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Failed to load chart data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-bold">
                {isLoading ? "Loading..." : formatCurrency(currentRevenue)}
              </span>
              {!isLoading && (
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
              )}
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
                disabled={isLoading}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Loading chart data...
          </div>
        ) : (
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(142, 76%, 36%)",
              },
            }}
            className="h-[300px] w-full"
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
                  tickFormatter={(value) => formatCurrency(Number(value))}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value) => [formatCurrency(Number(value))]}
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
        )}
      </CardContent>
    </Card>
  );
}
