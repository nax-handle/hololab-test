import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useMemo, useState } from "react";
import { useGetOrdersOverview } from "@/hooks/use-order";
import { formatCurrency } from "@/lib/order";

export default function Stat() {
  const [quickDateRange, setQuickDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(new Date().setDate(new Date().getDate())),
  });

  const handleQuickDateRangeChange = (range: DateRange | undefined) => {
    setQuickDateRange(range);
  };

  const clearQuickDateRange = () => {
    setQuickDateRange(undefined);
  };

  const overviewParams = useMemo(() => {
    if (quickDateRange?.from && quickDateRange?.to) {
      return {
        fromDate: format(quickDateRange.from, "yyyy-MM-dd"),
        toDate: format(quickDateRange.to, "yyyy-MM-dd"),
      };
    }
    return undefined;
  }, [quickDateRange]);

  const { data: overviewData } = useGetOrdersOverview(overviewParams);
  const overview = overviewData?.[0];
  return (
    <div className="space-y-4">
      <div className="flex justify-end w-full items-center gap-4">
        <div className="flex items-center ">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal bg-transparent min-w-[240px]"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {quickDateRange?.from ? (
                  quickDateRange.to ? (
                    <>
                      {format(quickDateRange.from, "MMM dd")} -{" "}
                      {format(quickDateRange.to, "MMM dd, yyyy")}
                    </>
                  ) : (
                    format(quickDateRange.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span className="text-muted-foreground">
                    Select date range
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={quickDateRange?.from}
                selected={quickDateRange}
                onSelect={handleQuickDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        {quickDateRange?.from && (
          <Button variant="ghost" size="sm" onClick={clearQuickDateRange}>
            <X />
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.totalOrders ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {quickDateRange?.from && quickDateRange?.to
                ? `${format(quickDateRange.from, "MMM dd")} - ${format(
                    quickDateRange.to,
                    "MMM dd, yyyy"
                  )}`
                : "Select date range"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.inProgressCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending & in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overview?.completedCount ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(overview?.completedAmount ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              From completed orders
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
