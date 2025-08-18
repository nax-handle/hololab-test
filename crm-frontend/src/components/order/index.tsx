"use client";

import OrderList from "@/components/order/order-list";
import { AddOrderModal } from "@/components/order/modal/add-order-modal";

export default function OrderManagement() {
  return (
    <div className=" space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order Management
          </h1>
          <p className="text-muted-foreground">
            Track and manage all your customer orders
          </p>
        </div>
        <AddOrderModal />
      </div>
      <OrderList></OrderList>
    </div>
  );
}
