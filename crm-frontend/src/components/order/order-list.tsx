"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { OrderFiltersComponent } from "./filters/order-filter";
import { ActiveFilters } from "./filters/active-filter";
import { getStatusColor, formatCurrency } from "@/lib/order";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { EditOrderModal, DeleteOrderModal, ViewOrderModal } from "./modal";
import { Order, OrderFilters, OrdersQueryParams } from "@/types/order";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetOrders } from "@/hooks/use-order";
import { useDebounce } from "@/hooks/use-debounce";
interface OrderListProps {
  limit?: number;
  customer?: string;
}
export default function OrderList({ limit = 7, customer }: OrderListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<OrderFilters>({ customer });
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const convertFiltersToApiParams = (
    filters: OrderFilters
  ): OrdersQueryParams => {
    const apiParams: OrdersQueryParams = {};

    if (filters.status) {
      apiParams.status = filters.status;
    }
    if (filters.orderType) {
      apiParams.sortBy = filters.orderType;
    }
    if (filters.customer) {
      apiParams.customer = filters.customer;
    }
    if (filters.dateRange) {
      apiParams.fromDate = filters.dateRange.start.toISOString();
      apiParams.toDate = filters.dateRange.end.toISOString();
    }
    if (filters.amountRange) {
      if (filters.amountRange.min !== undefined) {
        apiParams.minTotalAmount = filters.amountRange.min;
      }
      if (filters.amountRange.max !== undefined) {
        apiParams.maxTotalAmount = filters.amountRange.max;
      }
    }

    return apiParams;
  };

  const handleFiltersChange = (newFilters: OrderFilters) => {
    setFilters(newFilters);
    setPage(1);
  };
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleDeleteOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm("");
    setPage(1);
  };
  const handleRemoveFilter = (filterKey: string) => {
    const newFilters = { ...filters };
    delete (newFilters as Record<string, unknown>)[filterKey];
    setFilters(newFilters);
    setPage(1);
  };
  const handleOrderUpdate = (updatedOrder: Order) => {
    setSelectedOrder(updatedOrder);
  };
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const apiParams: OrdersQueryParams = {
    page,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: debouncedSearchTerm || undefined,
    ...convertFiltersToApiParams(filters),
  };

  const { data, isLoading } = useGetOrders(apiParams);

  useEffect(() => {
    if (data) {
      setItems(data.items);
      setTotalPages(Number(data.meta.totalPages) || 1);
    }
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 w-full">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>{" "}
            <OrderFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>
          <ActiveFilters
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearFilters}
          />
        </div>
        <div className="rounded-md border mt-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No orders found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                items.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order._id}</TableCell>
                    <TableCell>{order.description}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {order.customer.fullName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.orderType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditOrder(order)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteOrder(order)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <ViewOrderModal
            order={selectedOrder}
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
          />
          <EditOrderModal
            order={selectedOrder}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onOrderUpdated={handleOrderUpdate}
          />
          <DeleteOrderModal
            order={selectedOrder}
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onOrderDeleted={() => {
              setIsDeleteModalOpen(false);
              setSelectedOrder(null);
            }}
          />
        </div>
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    isActive={page === idx + 1}
                    onClick={() => setPage(idx + 1)}
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {totalPages > 5 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
