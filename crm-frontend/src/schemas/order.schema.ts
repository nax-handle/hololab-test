import { ORDER_STATUS, ORDER_TYPE } from "@/types";
import z from "zod";

export const editOrderSchema = z.object({
  customer: z.string().min(1, "Customer ID is required"),
  orderType: z.nativeEnum(ORDER_TYPE),
  status: z.nativeEnum(ORDER_STATUS),
  totalAmount: z
    .string()
    .min(1, "Total amount is required")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Total amount must be a positive number"
    ),
  description: z.string().optional(),
});

export type EditOrderFormData = z.infer<typeof editOrderSchema>;
