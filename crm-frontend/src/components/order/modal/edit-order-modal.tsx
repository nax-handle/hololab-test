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
  FormMessage,
} from "@/components/ui/form";
import { useUpdateOrder } from "@/hooks/use-order";
import { ORDER_STATUS, UpdateOrderData } from "@/types/order";
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
      status: ORDER_STATUS.PENDING,
    },
  });

  const updateOrderMutation = useUpdateOrder();

  useEffect(() => {
    if (order) {
      form.reset({
        status: order.status as ORDER_STATUS,
      });
    }
  }, [order, form]);

  const onSubmit = async (data: EditOrderFormData) => {
    if (!order) return;

    const updateData: UpdateOrderData = {
      status: data.status,
    };
    updateData.status = data.status;

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
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Only can update follow this flow: Pending -&gt; Processing -&gt;
            Completed
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
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
