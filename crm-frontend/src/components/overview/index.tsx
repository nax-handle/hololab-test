"use client";

// import { mockOrders } from "@/lib/mock-data";
// import type { Order } from "@/lib/types";

// import { OrderFiltersComponent } from "./order-filters";
// import { OrderDetailsModal } from "./order-details-modal";
import { RevenueChart } from "./revenue-chart";
import OrderList from "@/components/order/order-list";
import Stat from "./stat";
// import { TopCustomers } from "./top-customers";

export function OrderDashboard() {
  // const [orders, setOrders] = useState<Order[]>(mockOrders);

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
      {/* Revenue Chart and Top Customers Section */}
      <RevenueChart />

      <div className=""></div>
      <div>{/* <TopCustomers /> */}</div>

      <OrderList></OrderList>
    </div>
  );
}
