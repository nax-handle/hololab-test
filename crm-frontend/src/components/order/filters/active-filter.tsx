"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { OrderFilters } from "@/types/order";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/order";

interface ActiveFiltersProps {
  filters: OrderFilters;
  onRemoveFilter: (filterKey: keyof OrderFilters) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersProps) {
  const activeFilters = [];

  if (filters.status) {
    activeFilters.push({
      key: "status" as keyof OrderFilters,
      label: `Status: ${filters.status}`,
      value: filters.status,
    });
  }

  if (filters.orderType) {
    activeFilters.push({
      key: "orderType" as keyof OrderFilters,
      label: `Type: ${filters.orderType}`,
      value: filters.orderType,
    });
  }

  if (filters.customer) {
    activeFilters.push({
      key: "customer" as keyof OrderFilters,
      label: `Customer: ${filters.customer}`,
      value: filters.customer,
    });
  }

  if (filters.dateRange) {
    activeFilters.push({
      key: "dateRange" as keyof OrderFilters,
      label: `Date: ${format(filters.dateRange.start, "MMM dd")} - ${format(
        filters.dateRange.end,
        "MMM dd"
      )}`,
      value: filters.dateRange,
    });
  }

  if (filters.amountRange) {
    const { min, max } = filters.amountRange;
    const rangeText = `${formatCurrency(min ?? 0)} - ${formatCurrency(
      max ?? 0
    )}`;

    activeFilters.push({
      key: "amountRange" as keyof OrderFilters,
      label: `Amount: ${rangeText}`,
      value: filters.amountRange,
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {filter.label}
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 hover:bg-transparent"
            onClick={() => onRemoveFilter(filter.key)}
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-muted-foreground"
      >
        Clear all
      </Button>
    </div>
  );
}
