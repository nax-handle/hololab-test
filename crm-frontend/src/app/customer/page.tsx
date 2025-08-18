import CustomerManagement from "@/components/customer";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Customer Management",
  description: "View your CRM dashboard with orders, customers, and analytics",
};
export default function CustomerPage() {
  return <CustomerManagement />;
}
