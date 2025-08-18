import { ApiResponse, Paginated } from "@/types";
import http from "./http";

export type CustomersQueryParams = {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
};

export type CreateCustomerData = {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
};

export async function getCustomers<T>(
  params?: CustomersQueryParams
): Promise<ApiResponse<Paginated<T>>> {
  const data = await http.get<ApiResponse<Paginated<T>>>("/customers", {
    params,
  });
  return data.data;
}

export async function createCustomer<T>(
  customerData: CreateCustomerData
): Promise<ApiResponse<T>> {
  const data = await http.post<ApiResponse<T>>("/customers", customerData);
  return data.data;
}
