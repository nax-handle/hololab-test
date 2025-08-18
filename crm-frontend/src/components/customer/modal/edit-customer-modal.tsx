"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateCustomer } from "@/hooks/use-customer";
import { Customer, UpdateCustomerData } from "@/types/customer";

const editCustomerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format"),
  companyName: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
});

type EditCustomerFormData = z.infer<typeof editCustomerSchema>;

interface EditCustomerModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onCustomerUpdated?: (updatedCustomer: Customer) => void;
}

export function EditCustomerModal({
  customer,
  isOpen,
  onClose,
  onCustomerUpdated,
}: EditCustomerModalProps) {
  const form = useForm<EditCustomerFormData>({
    resolver: zodResolver(editCustomerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      address: "",
    },
  });

  const updateCustomerMutation = useUpdateCustomer();

  useEffect(() => {
    if (customer) {
      form.reset({
        fullName: customer.fullName || "",
        email: customer.email || "",
        phone: customer.phone || "",
        companyName: customer.companyName || "",
        address: customer.address || "",
      });
    }
  }, [customer, form]);

  const onSubmit = async (data: EditCustomerFormData) => {
    if (!customer) return;
    const updateData: UpdateCustomerData = {};

    if (data.fullName !== customer.fullName) {
      updateData.fullName = data.fullName;
    }
    if (data.email !== customer.email) {
      updateData.email = data.email;
    }
    if (data.phone !== customer.phone) {
      updateData.phone = data.phone;
    }
    if (data.companyName !== customer.companyName) {
      updateData.companyName = data.companyName;
    }
    if (data.address !== customer.address) {
      updateData.address = data.address;
    }

    if (Object.keys(updateData).length > 0) {
      await updateCustomerMutation.mutateAsync({
        id: customer._id,
        data: updateData,
      });
    }

    onClose();
    onCustomerUpdated?.(customer);
  };

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>
            Update customer information. Only changed fields will be updated.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter address" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateCustomerMutation.isPending}>
                {updateCustomerMutation.isPending
                  ? "Updating..."
                  : "Update Customer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
