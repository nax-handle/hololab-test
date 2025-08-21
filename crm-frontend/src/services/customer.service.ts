import { ApiResponse, Paginated } from "@/types";
import {
  CreateCustomerData,
  UpdateCustomerData,
  CustomersQueryParams,
} from "@/types";
import axiosInstance from "./axios";

export async function getCustomers<T>(
  params?: CustomersQueryParams
): Promise<ApiResponse<Paginated<T>>> {
  const data = await axiosInstance.get<ApiResponse<Paginated<T>>>(
    "/customers",
    {
      params,
    }
  );
  return data.data;
}

export async function getCustomer<T>(id: string): Promise<ApiResponse<T>> {
  const data = await axiosInstance.get<ApiResponse<T>>(`/customers/${id}`);
  return data.data;
}

export async function createCustomer<T>(
  customerData: CreateCustomerData
): Promise<ApiResponse<T>> {
  const data = await axiosInstance.post<ApiResponse<T>>(
    "/customers",
    customerData
  );
  return data.data;
}

export async function updateCustomer<T>(
  id: string,
  customerData: UpdateCustomerData
): Promise<ApiResponse<T>> {
  const data = await axiosInstance.patch<ApiResponse<T>>(
    `/customers/${id}`,
    customerData
  );
  return data.data;
}

export async function deleteCustomer<T>(id: string): Promise<ApiResponse<T>> {
  const data = await axiosInstance.delete<ApiResponse<T>>(`/customers/${id}`);
  return data.data;
}

export async function searchCustomer<T>(q: string): Promise<ApiResponse<T>> {
  const data = await axiosInstance.get<ApiResponse<T>>(`/customers/search`, {
    params: { q },
  });
  return data.data;
}
