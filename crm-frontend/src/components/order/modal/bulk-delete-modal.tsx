"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/order";
import { useBulkDeleteOrders } from "@/hooks/use-order";
import { toast } from "sonner";
import type { Order } from "@/types/order";

interface BulkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrders: Set<string>;
  orders: Order[];
  onOrdersDeleted: () => void;
}

export function BulkDeleteModal({
  isOpen,
  onClose,
  selectedOrders,
  orders,
  onOrdersDeleted,
}: BulkDeleteModalProps) {
  const bulkDeleteMutation = useBulkDeleteOrders();

  const selectedOrdersData = orders.filter((order) =>
    selectedOrders.has(order._id)
  );

  const totalAmount = selectedOrdersData.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const handleConfirmDelete = async () => {
    if (selectedOrders.size === 0) {
      toast.error("Please select orders to delete");
      return;
    }
    await bulkDeleteMutation.mutateAsync(Array.from(selectedOrders));
    onOrdersDeleted();
    onClose();
  };

  const handleClose = () => {
    if (!bulkDeleteMutation.isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Delete Selected Orders</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {selectedOrders.size} selected
            orders? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {selectedOrdersData.length > 0 && (
          <div className="py-4 space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Orders to be deleted:
            </h4>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {selectedOrdersData.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {order.description}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      <span className="text-black">
                        {order.customer.fullName}
                      </span>{" "}
                      - {order.customer.email}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ID: {order._id}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Total Amount:</span>
                <span className="font-bold">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={bulkDeleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={bulkDeleteMutation.isPending}
          >
            {bulkDeleteMutation.isPending ? "Deleting..." : "Delete Orders"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
