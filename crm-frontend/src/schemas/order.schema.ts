import { ORDER_STATUS } from "@/types";
import z from "zod";

export const editOrderSchema = z.object({
  status: z.nativeEnum(ORDER_STATUS),
});

export type EditOrderFormData = z.infer<typeof editOrderSchema>;
