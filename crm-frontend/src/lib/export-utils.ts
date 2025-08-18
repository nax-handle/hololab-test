import * as XLSX from "xlsx";
import { Order } from "@/types/order";
import { formatCurrency, formatDate } from "./order";
import { Customer } from "@/types";

export interface ExportOrderData {
  "Order ID": string;
  "Customer Name": string;
  "Customer Email": string;
  "Order Type": string;
  Status: string;
  "Total Amount": string;
  Description: string;
  "Created Date": string;
  "Updated Date": string;
}

export function exportOrdersToExcel(
  orders: Order[],
  filename: string = "orders-export.xlsx"
) {
  const exportData: ExportOrderData[] = orders.map((order) => ({
    "Order ID": order._id,
    "Customer Name": order.customer.fullName,
    "Customer Email": order.customer.email,
    "Order Type": order.orderType,
    Status: order.status,
    "Total Amount": formatCurrency(order.totalAmount),
    Description: order.description || "",
    "Created Date": formatDate(new Date(order.createdAt)),
    "Updated Date": formatDate(new Date(order.updatedAt)),
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  const columnWidths = [
    { wch: 24 },
    { wch: 20 },
    { wch: 25 },
    { wch: 12 },
    { wch: 12 },
    { wch: 15 },
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
  ];
  worksheet["!cols"] = columnWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

  const timestamp = new Date().toISOString().split("T")[0];
  const finalFilename = filename.replace(".xlsx", `-${timestamp}.xlsx`);

  XLSX.writeFile(workbook, finalFilename);
}

export function exportCustomersToExcel(
  customers: Customer[],
  filename: string = "customers-export.xlsx"
) {
  const exportData = customers.map((customer) => ({
    "Customer ID": customer._id,
    "Full Name": customer.fullName,
    Email: customer.email,
    Phone: customer.phone,
    Company: customer.companyName,
    Address: customer.address,
    "Created Date": new Date(customer.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    Status: customer.isDeleted ? "Deleted" : "Active",
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  const columnWidths = [
    { wch: 24 },
    { wch: 20 },
    { wch: 25 },
    { wch: 15 },
    { wch: 20 },
    { wch: 40 },
    { wch: 15 },
    { wch: 10 },
  ];
  worksheet["!cols"] = columnWidths;

  XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

  const timestamp = new Date().toISOString().split("T")[0];
  const finalFilename = filename.replace(".xlsx", `-${timestamp}.xlsx`);

  XLSX.writeFile(workbook, finalFilename);
}
