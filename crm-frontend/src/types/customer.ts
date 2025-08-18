export interface Customer {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

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

export type UpdateCustomerData = {
  fullName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  address?: string;
};
