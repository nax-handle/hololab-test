"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/services/customer.service";
import type {
  ApiError,
  Customer,
  CustomersQueryParams,
  UpdateCustomerData,
} from "@/types";
import type { Paginated } from "@/types/paginate";
import { toast } from "sonner";

export function useGetCustomers(
  params: CustomersQueryParams
): UseQueryResult<Paginated<Customer>, Error> {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => getCustomers<Customer>(params),
    select: (res) => res.data,
    throwOnError: (error) => {
      toast.error(error.message);
      return true;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useGetCustomer(id: string): UseQueryResult<Customer, Error> {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomer<Customer>(id),
    select: (res) => res.data,
    throwOnError: (error) => {
      toast.error(error.message);
      return true;
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer<Customer>,
    onSuccess: () => {
      toast.success("Customer created successfully");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.response.data.message);
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerData }) =>
      updateCustomer<Customer>(id, data),
    onSuccess: () => {
      toast.success("Customer updated successfully");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.response.data.message);
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer<Customer>,
    onSuccess: () => {
      toast.success("Customer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.response.data.message);
    },
  });
}
