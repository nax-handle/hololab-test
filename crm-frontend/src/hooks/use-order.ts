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
} from "@/services/order.service";
import type { Order, OrdersQueryParams, UpdateOrderData } from "@/types/order";
import type { Paginated } from "@/types/paginate";
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
