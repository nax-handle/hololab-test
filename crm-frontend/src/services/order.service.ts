import {
  ApiResponse,
  OrdersQueryParams,
  Paginated,
  UpdateOrderData,
} from "@/types";
import axiosInstance from "./http";

export async function getOrders<T>(
  params?: OrdersQueryParams
): Promise<ApiResponse<Paginated<T>>> {
  const data = await axiosInstance.get<ApiResponse<Paginated<T>>>("/orders", {
    params,
  });
  return data.data;
}

export async function createOrder<T>(orderData: {
  customer: string;
  orderType: string;
  totalAmount: number;
  description: string;
}): Promise<ApiResponse<T>> {
  const data = await axiosInstance.post<ApiResponse<T>>("/orders", orderData);
  return data.data;
}

export async function updateOrder<T>(
  id: string,
  updateData: UpdateOrderData
): Promise<ApiResponse<T>> {
  const data = await axiosInstance.patch<ApiResponse<T>>(
    `/orders/${id}`,
    updateData
  );
  return data.data;
}

export async function deleteOrder<T>(id: string): Promise<ApiResponse<T>> {
  const data = await axiosInstance.delete<ApiResponse<T>>(`/orders/${id}`);
  return data.data;
}

export async function bulkDeleteOrders(
  orderIds: string[]
): Promise<ApiResponse<{ deletedCount: number }>> {
  const data = await axiosInstance.post<ApiResponse<{ deletedCount: number }>>(
    "/orders/bulk-delete",
    { orderIds }
  );
  return data.data;
}

// Overview
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

export async function getOrdersOverview(
  params: OrdersOverviewParams
): Promise<ApiResponse<OrderOverview[]>> {
  const data = await axiosInstance.get<ApiResponse<OrderOverview[]>>(
    "/orders/overview",
    { params }
  );
  return data.data;
}
