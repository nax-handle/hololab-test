import { ApiResponse, Paginated } from "@/types";
import {
  CreateCustomerData,
  UpdateCustomerData,
  CustomersQueryParams,
} from "@/types";
import http from "./http";

export async function getCustomers<T>(
  params?: CustomersQueryParams
): Promise<ApiResponse<Paginated<T>>> {
  const data = await http.get<ApiResponse<Paginated<T>>>("/customers", {
    params,
  });
  return data.data;
}

export async function getCustomer<T>(id: string): Promise<ApiResponse<T>> {
  const data = await http.get<ApiResponse<T>>(`/customers/${id}`);
  return data.data;
}

export async function createCustomer<T>(
  customerData: CreateCustomerData
): Promise<ApiResponse<T>> {
  const data = await http.post<ApiResponse<T>>("/customers", customerData);
  return data.data;
}

export async function updateCustomer<T>(
  id: string,
  customerData: UpdateCustomerData
): Promise<ApiResponse<T>> {
  const data = await http.patch<ApiResponse<T>>(
    `/customers/${id}`,
    customerData
  );
  return data.data;
}

export async function deleteCustomer<T>(id: string): Promise<ApiResponse<T>> {
  const data = await http.delete<ApiResponse<T>>(`/customers/${id}`);
  return data.data;
}
