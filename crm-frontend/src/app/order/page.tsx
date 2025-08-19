import OrderManagement from "@/components/order";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Management",
  description: "View your CRM dashboard with orders, customers, and analytics",
};
export default function OrderPage() {
  return (
    <div>
      <OrderManagement></OrderManagement>
    </div>
  );
}
