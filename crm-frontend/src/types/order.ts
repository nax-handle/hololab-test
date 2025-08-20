import { Customer } from "./customer";

export enum ORDER_TYPE {
  SALES = "sales",
  SERVICE = "service",
  SUBSCRIPTION = "subscription",
}

export enum ORDER_STATUS {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Order {
  _id: string;
  customer: Customer;
  orderType: ORDER_TYPE;
  status: ORDER_STATUS;
  totalAmount: number;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderFilters {
  status?: ORDER_STATUS;
  orderType?: ORDER_TYPE;
  dateRange?: {
    start: Date;
    end: Date;
  };
  customer?: string;
  amountRange?: {
    min?: number;
    max?: number;
  };
}

export type UpdateOrderData = {
  status: string;
};

export type OrdersQueryParams = {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  orderType?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: string;
  minTotalAmount?: number | string;
  maxTotalAmount?: number | string;
  fromDate?: string;
  toDate?: string;
  customer?: string;
};

export type OrdersOverviewParams = {
  fromDate: string;
  toDate: string;
};

export interface OrderOverview {
  totalOrders: number;
  totalRevenue: number;
  inProgressCount: number;
  completedCount: number;
  completedAmount: number;
}

export type ChartRange = "1d" | "7d" | "1m" | "1y" | "all";

export interface ChartParams {
  range: ChartRange;
}

export interface ChartDataPoint {
  bucket: number;
  revenue: number;
}

export interface ChartResponse {
  data: Array<{
    result: ChartDataPoint[];
  }>;
  range: string;
}
