"use client";

import { RevenueChart } from "./revenue-chart";
import OrderList from "@/components/order/order-list";
import Stat from "./stat";

export function OrderDashboard() {
  return (
    <div className=" space-y-6">
      <div className="flex   items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground ">
            Track and manage all your customer orders
          </p>
        </div>
      </div>

      <Stat />
      <RevenueChart />

      <div className=""></div>
      <OrderList></OrderList>
    </div>
  );
}
