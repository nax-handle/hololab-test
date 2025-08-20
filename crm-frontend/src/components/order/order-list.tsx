"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Search, Trash2, Download } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { OrderFiltersComponent } from "./filters/order-filter";
import { ActiveFilters } from "./filters/active-filter";
import { getStatusColor, formatCurrency } from "@/lib/order";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  EditOrderModal,
  DeleteOrderModal,
  ViewOrderModal,
  BulkDeleteModal,
} from "./modal";
import {
  Order,
  ORDER_STATUS,
  OrderFilters,
  OrdersQueryParams,
} from "@/types/order";
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
import { exportOrdersToExcel } from "@/lib/export-utils";
import { toast } from "sonner";

interface OrderListProps {
  limit?: number;
  customer?: string;
}

export default function OrderList({ limit = 7, customer }: OrderListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<OrderFilters>({ customer });
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const convertFiltersToApiParams = (
    filters: OrderFilters
  ): OrdersQueryParams => {
    const apiParams: OrdersQueryParams = {};

    if (filters.status) {
      apiParams.status = filters.status;
    }
    if (filters.orderType) {
      apiParams.orderType = filters.orderType;
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

  const handleRemoveFilter = (filterKey: keyof OrderFilters) => {
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
      setSelectedOrders(new Set());
    }
  }, [data]);

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    const newSelected = new Set(selectedOrders);
    if (checked) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(items.map((order) => order._id));
      setSelectedOrders(allIds);
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleBulkDelete = () => {
    if (selectedOrders.size === 0) {
      toast.error("Please select orders to delete");
      return;
    }
    setIsBulkDeleteModalOpen(true);
  };

  const handleBulkDeleteSuccess = () => {
    setSelectedOrders(new Set());
    setIsBulkDeleteModalOpen(false);
  };

  const isAllSelected =
    items.length > 0 && selectedOrders.size === items.length;
  const isIndeterminate =
    selectedOrders.size > 0 && selectedOrders.size < items.length;

  const handleExportExcel = () => {
    try {
      if (items.length === 0) {
        toast.error("No orders to export");
        return;
      }

      const filename = customer
        ? `customer-orders-${customer}.xlsx`
        : "orders-export.xlsx";

      exportOrdersToExcel(items, filename);
      toast.success(`Exported ${items.length} orders to Excel`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export orders");
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="space-y-4 w-full">
          <div className="flex flex-wrap  items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <OrderFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>
          <div className="flex">
            <ActiveFilters
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearFilters}
            />
            {selectedOrders.size > 0 && (
              <Button
                onClick={handleBulkDelete}
                variant="destructive"
                className="ml-2"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedOrders.size})
              </Button>
            )}
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <Table className="w-full ">
            <TableHeader>
              <TableRow>
                <TableHead className="w-fit">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    {...(isIndeterminate && { "data-state": "indeterminate" })}
                  />
                </TableHead>
                <TableHead className="hidden sm:table-cell">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell>
                      {order.status === ORDER_STATUS.PENDING && (
                        <Checkbox
                          checked={selectedOrders.has(order._id)}
                          onCheckedChange={(checked) =>
                            handleSelectOrder(order._id, checked as boolean)
                          }
                          aria-label={`Select order ${order._id}`}
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium hidden sm:table-cell">
                      <span className="font-mono text-xs">{order._id}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {order.customer.fullName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.customer.email}
                        </div>
                        <div className="sm:hidden text-xs text-muted-foreground mt-1">
                          {order.orderType} •{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
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
                    <TableCell className="hidden lg:table-cell">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {(order.status === ORDER_STATUS.PENDING ||
                          order.status === ORDER_STATUS.PROCESSING) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditOrder(order)}
                          >
                            <ArrowUpDown className="w-4 h-4" />
                          </Button>
                        )}
                        {order.status === ORDER_STATUS.PENDING && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteOrder(order)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex max-md:flex-wrap">
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

          <Button
            onClick={handleExportExcel}
            disabled={isLoading || items.length === 0}
            className="ml-auto mt-2"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>

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
        <BulkDeleteModal
          isOpen={isBulkDeleteModalOpen}
          onClose={() => setIsBulkDeleteModalOpen(false)}
          selectedOrders={selectedOrders}
          orders={items}
          onOrdersDeleted={handleBulkDeleteSuccess}
        />
      </CardContent>
    </Card>
  );
}
