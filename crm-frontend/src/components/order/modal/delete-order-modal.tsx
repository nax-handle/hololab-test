"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteOrder } from "@/hooks/use-order";
import { Order } from "@/types/order";
import { AlertTriangle } from "lucide-react";

interface DeleteOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderDeleted?: () => void;
}

export function DeleteOrderModal({
  order,
  isOpen,
  onClose,
  onOrderDeleted,
}: DeleteOrderModalProps) {
  const deleteOrderMutation = useDeleteOrder();

  const handleDelete = async () => {
    if (!order) return;

    await deleteOrderMutation.mutateAsync(order._id);
    onClose();
    onOrderDeleted?.();
  };

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Order
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this order? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Order Details:</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>ID:</strong> {order._id}
              </p>
              <p>
                <strong>Customer:</strong> {order.customer.fullName}
              </p>
              <p>
                <strong>Type:</strong> {order.orderType}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Amount:</strong> {order.totalAmount}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={deleteOrderMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteOrderMutation.isPending}
          >
            {deleteOrderMutation.isPending ? "Deleting..." : "Delete Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
