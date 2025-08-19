"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/order";
import { getStatusColor, formatCurrency, formatDate } from "@/lib/order";
import { Calendar, User, DollarSign, FileText, Tag } from "lucide-react";

interface ViewOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewOrderModal({
  order,
  isOpen,
  onClose,
}: ViewOrderModalProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            View complete information about this order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Order ID
            </h3>
            <p className="text-sm font-mono bg-muted p-2 rounded">
              {order._id}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </h3>
            <div className="space-y-1">
              <p className="text-sm">
                <strong>Name:</strong> {order.customer.fullName}
              </p>
              <p className="text-sm">
                <strong>Email:</strong> {order.customer.email}
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> {order.customer.phone}
              </p>
              <p className="text-sm">
                <strong>Company:</strong> {order.customer.companyName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Order Type
              </h3>
              <Badge variant="outline">{order.orderType}</Badge>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Status
              </h3>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Amount
            </h3>
            <p className="text-2xl font-bold">
              {formatCurrency(order.totalAmount)}
            </p>
          </div>

          {order.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </h3>
              <p className="text-sm bg-muted p-3 rounded">
                {order.description}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Important Dates
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong>Created:</strong>
                </p>
                <p className="text-muted-foreground">
                  {formatDate(new Date(order.createdAt))}
                </p>
              </div>
              <div>
                <p>
                  <strong>Updated:</strong>
                </p>
                <p className="text-muted-foreground">
                  {formatDate(new Date(order.updatedAt))}
                </p>
              </div>
              {order.startDate && (
                <div>
                  <p>
                    <strong>Start Date:</strong>
                  </p>
                  <p className="text-muted-foreground">
                    {formatDate(new Date(order.startDate))}
                  </p>
                </div>
              )}
              {order.endDate && (
                <div>
                  <p>
                    <strong>End Date:</strong>
                  </p>
                  <p className="text-muted-foreground">
                    {formatDate(new Date(order.endDate))}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
