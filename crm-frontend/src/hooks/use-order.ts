"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  bulkDeleteOrders,
  getOrdersOverview,
  getOrderChart,
} from "@/services/order.service";
import type {
  Order,
  OrdersOverviewParams,
  OrdersQueryParams,
  UpdateOrderData,
  Paginated,
  ApiResponse,
  OrderOverview,
  ChartResponse,
  ChartParams,
  ApiError,
} from "@/types";
import { toast } from "sonner";

export function useGetOrders(
  params: OrdersQueryParams
): UseQueryResult<Paginated<Order>, Error> {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders<Order>(params),
    select: (res) => res.data,
    throwOnError: (error) => {
      toast.error(error.message);
      return true;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useGetOrdersOverview(
  params: OrdersOverviewParams | undefined
): UseQueryResult<OrderOverview[], Error> {
  return useQuery({
    queryKey: ["orders-overview", params],
    queryFn: () => getOrdersOverview(params as OrdersOverviewParams),
    enabled: Boolean(params?.fromDate && params?.toDate),
    select: (res: ApiResponse<OrderOverview[]>) => res.data,
    throwOnError: (error) => {
      toast.error(error.message);
      return true;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder<Order>,
    onSuccess: () => {
      toast.success("Order created successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.response.data.message || "Failed to create order");
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderData }) =>
      updateOrder<Order>(id, data),
    onSuccess: () => {
      toast.success("Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.response.data.message);
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrder<Order>,
    onSuccess: () => {
      toast.success("Order deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.response.data.message || "Failed to delete order");
    },
  });
}

export function useBulkDeleteOrders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteOrders,
    onSuccess: (data) => {
      toast.success(`${data.data.deletedCount} orders deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.response.data.message || "Failed to delete orders");
    },
  });
}

export function useGetOrderChart(
  params: ChartParams
): UseQueryResult<ChartResponse, Error> {
  return useQuery({
    queryKey: ["orders-chart", params],
    queryFn: () => getOrderChart(params),
    select: (res: ApiResponse<ChartResponse>) => res.data,
    throwOnError: (error) => {
      toast.error(error.message);
      return true;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
