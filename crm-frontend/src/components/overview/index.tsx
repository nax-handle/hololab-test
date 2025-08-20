"use client";

import { RevenueChart } from "./revenue-chart";
import OrderList from "@/components/order/order-list";
import Stat from "./stat";

export function OrderDashboard() {
  return (
    <div className=" space-y-6">
    

      <Stat />
      <RevenueChart />

      <div className=""></div>
      <OrderList></OrderList>
    </div>
  );
}
