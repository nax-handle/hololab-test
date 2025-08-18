"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  getCustomers,
  createCustomer,
  type CustomersQueryParams,
  type CreateCustomerData,
} from "@/services/customer.service";
import type { Customer } from "@/types/customer";
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

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer<Customer>,
    onSuccess: () => {
      toast.success("Customer created successfully");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create customer");
    },
  });
}
