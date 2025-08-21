import { ORDER_STATUS, ORDER_TYPE } from "@/types";
import z from "zod";

export const editOrderSchema = z.object({
  status: z.nativeEnum(ORDER_STATUS),
});

export const addOrderSchema = z.object({
  customer: z.string().min(1, "Customer ID or Email is required"),
  orderType: z.nativeEnum(ORDER_TYPE, {
    message: "Please select a valid order type",
  }),
  totalAmount: z
    .number({ message: "Total amount must be a number" })
    .min(0.01, "Total amount must be greater than 0"),
  description: z.string().trim().min(1, "Description is required"),
});

export type EditOrderFormData = z.infer<typeof editOrderSchema>;
export type AddOrderFormData = z.infer<typeof addOrderSchema>;
