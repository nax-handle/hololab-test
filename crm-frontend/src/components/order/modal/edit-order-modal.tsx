"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateOrder } from "@/hooks/use-order";
import { ORDER_STATUS, ORDER_TYPE, UpdateOrderData } from "@/types/order";
import { Order } from "@/types/order";
import { editOrderSchema, EditOrderFormData } from "@/schemas";

interface EditOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated?: (updatedOrder: Order) => void;
}

export function EditOrderModal({
  order,
  isOpen,
  onClose,
  onOrderUpdated,
}: EditOrderModalProps) {
  const form = useForm<EditOrderFormData>({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      customer: "",
      orderType: ORDER_TYPE.SALES,
      status: ORDER_STATUS.PENDING,
      totalAmount: "",
      description: "",
    },
  });

  const updateOrderMutation = useUpdateOrder();

  useEffect(() => {
    if (order) {
      form.reset({
        customer: order.customer._id || "",
        orderType: order.orderType as ORDER_TYPE,
        status: order.status as ORDER_STATUS,
        totalAmount: order.totalAmount?.toString() || "",
        description: order.description || "",
      });
    }
  }, [order, form]);

  const onSubmit = async (data: EditOrderFormData) => {
    if (!order) return;

    const updateData: UpdateOrderData = {};
    if (data.orderType !== order.orderType) {
      updateData.orderType = data.orderType;
    }
    if (data.status !== order.status) {
      updateData.status = data.status;
    }
    if (parseFloat(data.totalAmount) !== order.totalAmount) {
      updateData.totalAmount = parseFloat(data.totalAmount);
    }
    if (data.description !== order.description) {
      updateData.description = data.description;
    }

    if (Object.keys(updateData).length > 0) {
      await updateOrderMutation.mutateAsync({
        id: order._id,
        data: updateData,
      });
    }

    onClose();
    onOrderUpdated?.(order);
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogDescription>
            Update order information. Only changed fields will be updated.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="orderType"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Order Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select order type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ORDER_TYPE).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ORDER_STATUS).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter order description"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateOrderMutation.isPending}>
                {updateOrderMutation.isPending ? "Updating..." : "Update Order"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
