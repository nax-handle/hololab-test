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
import { Search, Edit, Trash2, Eye, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Customer, CustomersQueryParams } from "@/types/customer";
import { ReusablePagination } from "@/components/ui/reusable-pagination";
import { useGetCustomers } from "@/hooks/use-customer";
import { useDebounce } from "@/hooks/use-debounce";
import { EditCustomerModal, DeleteCustomerModal } from "./modal";
import { useRouter } from "next/navigation";
import { exportCustomersToExcel, formatTimeZone } from "@/lib";
import { toast } from "sonner";

interface CustomerListProps {
  limit?: number;
}

export default function CustomerList({ limit = 10 }: CustomerListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Customer[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const apiParams: CustomersQueryParams = {
    page,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
    search: debouncedSearchTerm || undefined,
  };

  const { data, isLoading } = useGetCustomers(apiParams);

  useEffect(() => {
    if (data) {
      setItems(data.items as unknown as Customer[]);
      setTotalPages(Number(data.meta.totalPages) || 1);
    }
  }, [data]);

  const handleViewCustomer = (customer: Customer) => {
    router.push(`/customer/${customer._id}`);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const handleCustomerUpdate = (updatedCustomer: Customer) => {
    setSelectedCustomer(updatedCustomer);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  const handleExportExcel = () => {
    try {
      if (items.length === 0) {
        toast.error("No customers to export");
        return;
      }

      exportCustomersToExcel(items, "customers-export.xlsx");
      toast.success(`Exported ${items.length} customers to Excel`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export customers");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardContent>
        <div className="space-y-4 w-full">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchTerm && (
              <Button variant="outline" size="sm" onClick={handleClearSearch}>
                Clear
              </Button>
            )}
          </div>
        </div>
        <div className="rounded-md border mt-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
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
                    No customers found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                items.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell className="font-medium">
                      <span className="font-mono text-xs">{customer._id}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.fullName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {customer.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{customer.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{customer.companyName}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                    <TableCell>{formatTimeZone(customer.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex max-md:flex-wrap">
          <ReusablePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
          <Button
            onClick={handleExportExcel}
            disabled={isLoading || items.length === 0}
            className="ml-auto mt-2"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>

        <EditCustomerModal
          customer={selectedCustomer}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onCustomerUpdated={handleCustomerUpdate}
        />
        <DeleteCustomerModal
          customer={selectedCustomer}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onCustomerDeleted={() => {
            setIsDeleteModalOpen(false);
            setSelectedCustomer(null);
          }}
        />
      </CardContent>
    </Card>
  );
}
