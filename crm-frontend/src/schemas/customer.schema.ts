import z from "zod";

export const addCustomerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(9, "Phone number is required")
    .max(10, "Phone number must be 10 digits"),
  companyName: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
});
export type AddCustomerFormData = z.infer<typeof addCustomerSchema>;
