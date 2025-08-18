"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useCreateOrder } from "@/hooks/use-order";
import { ORDER_STATUS, ORDER_TYPE } from "@/types/order";

interface AddOrderModalProps {
  onOrderCreated?: () => void;
}

export function AddOrderModal({ onOrderCreated }: AddOrderModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer: "",
    orderType: "sales",
    totalAmount: "",
    description: "",
  });

  const createOrderMutation = useCreateOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer || !formData.orderType || !formData.totalAmount) {
      return;
    }

    try {
      await createOrderMutation.mutateAsync({
        customer: formData.customer,
        orderType: formData.orderType,
        totalAmount: parseFloat(formData.totalAmount),
        description: formData.description,
      });

      setFormData({
        customer: "",
        orderType: "",
        totalAmount: "",
        description: "",
      });
      setOpen(false);
      onOrderCreated?.();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
          <DialogDescription>
            Create a new order with customer details and order information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer ID or Email</Label>
            <Input
              id="customer"
              value={formData.customer}
              onChange={(e) => handleInputChange("customer", e.target.value)}
              placeholder="Enter customer ID or Email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="orderType">Order Type</Label>
            <Select
              value={formData.orderType}
              onValueChange={(value) => handleInputChange("orderType", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select order type" /> 
              </SelectTrigger>
              <SelectContent>
                {Object.values(ORDER_TYPE).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalAmount">Total Amount</Label>
            <Input
              id="totalAmount"
              type="number"
              step="0.01"
              value={formData.totalAmount}
              onChange={(e) => handleInputChange("totalAmount", e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter order description"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createOrderMutation.isPending}>
              {createOrderMutation.isPending ? "Creating..." : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
