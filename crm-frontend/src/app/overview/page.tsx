import { OrderDashboard } from "@/components/overview";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview - CRM Dashboard",
  description: "View your CRM dashboard with orders, customers, and analytics",
};

export default function OverviewPage() {
  return (
    <div>
      <OrderDashboard />
    </div>
  );
}
