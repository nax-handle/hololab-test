"use client";

import CustomerList from "@/components/customer/customer-list";
import { AddCustomerModal } from "@/components/customer/modal/add-customer-modal";

export default function CustomerManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Customer Management
          </h1>
          <p className="text-muted-foreground">
            Manage and track all your customers
          </p>
        </div>
        <AddCustomerModal />
      </div>
      <CustomerList />
    </div>
  );
}
