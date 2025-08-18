"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Plus, Eye, CalendarIcon } from "lucide-react";
// import { mockOrders } from "@/lib/mock-data";
// import type { Order } from "@/lib/types";

// import { OrderFiltersComponent } from "./order-filters";
// import { OrderDetailsModal } from "./order-details-modal";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { RevenueChart } from "./revenue-chart";
import OrderList from "@/components/order/order-list";
// import { TopCustomers } from "./top-customers";

export function OrderDashboard() {
  // const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [quickDateRange, setQuickDateRange] = useState<DateRange | undefined>();

  // const stats = getOrderStats(orders);

  const handleQuickDateRangeChange = (range: DateRange | undefined) => {
    // setQuickDateRange(range);
    console.log(range);
  };

  const clearQuickDateRange = () => {
    setQuickDateRange(undefined);
  };

  return (
    <div className="p-6 container space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">
            Track and manage all your customer orders
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filter by date:</span>
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
                Clear Date Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{stats.total}</div> */}
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* {stats.pending + stats.inProgress} */}
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
            {/* <div className="text-2xl font-bold">{stats.completed}</div> */}
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
              {/* {formatCurrency(stats.totalRevenue)} */}
            </div>
            <p className="text-xs text-muted-foreground">
              From completed orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart and Top Customers Section */}
      <RevenueChart />

      <div className=""></div>
      <div>{/* <TopCustomers /> */}</div>

      <OrderList></OrderList>
    </div>
  );
}
