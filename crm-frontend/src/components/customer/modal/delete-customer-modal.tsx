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
import { useDeleteCustomer } from "@/hooks/use-customer";
import { Customer } from "@/types/customer";
import { AlertTriangle } from "lucide-react";

interface DeleteCustomerModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onCustomerDeleted?: () => void;
}

export function DeleteCustomerModal({
  customer,
  isOpen,
  onClose,
  onCustomerDeleted,
}: DeleteCustomerModalProps) {
  const deleteCustomerMutation = useDeleteCustomer();

  const handleDelete = async () => {
    if (!customer) return;

    await deleteCustomerMutation.mutateAsync(customer._id);
    onClose();
    onCustomerDeleted?.();
  };

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Customer
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this customer? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Customer Details:</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>ID:</strong> {customer._id}
              </p>
              <p>
                <strong>Name:</strong> {customer.fullName}
              </p>
              <p>
                <strong>Email:</strong> {customer.email}
              </p>
              <p>
                <strong>Phone:</strong> {customer.phone}
              </p>
              <p>
                <strong>Company:</strong> {customer.companyName}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={deleteCustomerMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteCustomerMutation.isPending}
          >
            {deleteCustomerMutation.isPending
              ? "Deleting..."
              : "Delete Customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
