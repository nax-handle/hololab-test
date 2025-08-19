"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  FileText,
  Edit3,
  Save,
  X,
} from "lucide-react";
import type { Order, ORDER_STATUS } from "@/types/order";
import { formatCurrency, formatDate } from "@/lib/order";
import { OrderStatusBadge } from "../badge/order-status-badge";
import { OrderStatusSelector } from "../filters/order-status-selector";
import { OrderStatusTimeline } from "../filters/order-status-timeline";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdate?: (updatedOrder: Order) => void;
}

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onOrderUpdate,
}: OrderDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");

  if (!order) return null;

  const handleStatusChange = (newStatus: ORDER_STATUS, note?: string) => {
    const updatedOrder = {
      ...order,
      status: newStatus,
      updatedAt: new Date(),
    };
    onOrderUpdate?.(updatedOrder);
    console.log(
      `[v0] Status changed to ${newStatus}${note ? ` with note: ${note}` : ""}`
    );
  };

  const handleDescriptionEdit = () => {
    setEditedDescription(order.description || "");
    setIsEditing(true);
  };

  const handleDescriptionSave = () => {
    const updatedOrder = {
      ...order,
      description: editedDescription,
      updatedAt: new Date(),
    };
    onOrderUpdate?.(updatedOrder);
    setIsEditing(false);
    console.log("[v0] Description updated:", editedDescription);
  };

  const handleDescriptionCancel = () => {
    setEditedDescription("");
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - {order._id}</span>
            <OrderStatusBadge status={order.status} showIcon size="lg" />
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {/* <AvatarInitials name={order.customer.name} /> */}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{order.customer.fullName}</p>
                    {order.customer.companyName && (
                      <p className="text-sm text-muted-foreground">
                        {order.customer.companyName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{order.customer.email}</span>
                  </div>
                  {order.customer.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{order.customer.phone}</span>
                    </div>
                  )}
                  {order.customer.companyName && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span>{order.customer.companyName}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Order Type
                    </Label>
                    <Badge variant="outline" className="mt-1">
                      {order.orderType}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Amount
                    </Label>
                    <p className="text-lg font-semibold flex items-center gap-1 mt-1">
                      <DollarSign className="w-4 h-4" />
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Start Date
                    </Label>
                    <p className="flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {order.startDate
                        ? formatDate(order.startDate)
                        : "Not set"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      End Date
                    </Label>
                    <p className="flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {order.endDate ? formatDate(order.endDate) : "Not set"}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-muted-foreground">
                      Description
                    </Label>
                    {!isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDescriptionEdit}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        placeholder="Enter order description..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleDescriptionSave}>
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDescriptionCancel}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm bg-muted p-3 rounded-md">
                      {order.description || "No description provided"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Management</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderStatusSelector
                  currentStatus={order.status}
                  onStatusChange={handleStatusChange}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <OrderStatusTimeline
              currentStatus={order.status}
              createdAt={order.createdAt}
              updatedAt={order.updatedAt}
            />

            <Card>
              <CardHeader>
                <CardTitle>Order Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Order ID
                  </span>
                  <span className="font-mono text-sm">{order._id}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">{formatDate(order.createdAt)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Last Updated
                  </span>
                  <span className="text-sm">{formatDate(order.updatedAt)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Duration
                  </span>
                  <span className="text-sm">
                    {order.startDate && order.endDate
                      ? `${Math.ceil(
                          (order.endDate.getTime() -
                            order.startDate.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} days`
                      : "Not specified"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email to Customer
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Invoice
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Order Details
                </Button>
                <Separator />
                <Button variant="destructive" className="w-full justify-start">
                  <X className="w-4 h-4 mr-2" />
                  Cancel Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
