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
  type OrdersOverviewParams,
} from "@/services/order.service";
import type { Order, OrdersQueryParams, UpdateOrderData } from "@/types/order";
import type { Paginated } from "@/types/paginate";
import { toast } from "sonner";
import type { ApiResponse } from "@/types/api";
import type { OrderOverview } from "@/services/order.service";

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
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create order");
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
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update order");
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
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete order");
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
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete orders");
    },
  });
}
