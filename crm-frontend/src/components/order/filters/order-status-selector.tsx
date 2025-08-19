"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ORDER_STATUS } from "@/types/order";
import { OrderStatusBadge } from "../badge/order-status-badge";
import { Edit3 } from "lucide-react";

interface OrderStatusSelectorProps {
  currentStatus: ORDER_STATUS;
  onStatusChange?: (newStatus: ORDER_STATUS, note?: string) => void;
  disabled?: boolean;
}

export function OrderStatusSelector({
  currentStatus,
  onStatusChange,
  disabled = false,
}: OrderStatusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<ORDER_STATUS>(currentStatus);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    {
      value: ORDER_STATUS.PENDING,
      label: "Pending",
      description: "Order received, awaiting confirmation",
    },
    {
      value: ORDER_STATUS.PROCESSING,
      label: "In Progress",
      description: "Work has started",
    },
    {
      value: ORDER_STATUS.COMPLETED,
      label: "Completed",
      description: "Order successfully completed",
    },
    {
      value: ORDER_STATUS.CANCELLED,
      label: "Cancelled",
      description: "Order cancelled",
    },
  ];

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    onStatusChange?.(selectedStatus, note);
    setIsOpen(false);
    setNote("");
    setIsLoading(false);
  };

  const getNextLogicalStatus = (current: ORDER_STATUS): ORDER_STATUS | null => {
    switch (current) {
      case ORDER_STATUS.PENDING:
        return ORDER_STATUS.PROCESSING;
      case ORDER_STATUS.PROCESSING:
        return ORDER_STATUS.COMPLETED;
      case ORDER_STATUS.COMPLETED:
        return ORDER_STATUS.CANCELLED;
      default:
        return null;
    }
  };

  const nextStatus = getNextLogicalStatus(currentStatus);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <OrderStatusBadge status={currentStatus} showIcon size="md" />

      {!disabled && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit3 className="w-4 h-4 mr-1" />
              Update Status
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">New Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    setSelectedStatus(value as ORDER_STATUS)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Add a note about this status change..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStatusUpdate} disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {nextStatus && !disabled && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onStatusChange?.(nextStatus)}
          className="text-blue-600 hover:text-blue-700"
        >
          Mark as {nextStatus.replace("_", " ")}
        </Button>
      )}
    </div>
  );
}
