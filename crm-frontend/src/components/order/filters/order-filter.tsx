"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Filter, X, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { type OrderFilters, ORDER_STATUS, ORDER_TYPE } from "@/types/order";

interface OrderFiltersProps {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  onClearFilters: () => void;
}

export function OrderFiltersComponent({
  filters,
  onFiltersChange,
  onClearFilters,
}: OrderFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    filters.dateRange
      ? {
          from: filters.dateRange.start,
          to: filters.dateRange.end,
        }
      : undefined
  );
  const [amountRange, setAmountRange] = useState({
    min: "",
    max: "",
  });

  const updateFilters = (newFilters: Partial<OrderFilters>) => {
    onFiltersChange({ ...filters, ...newFilters });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      updateFilters({
        dateRange: {
          start: range.from,
          end: range.to,
        },
      });
    } else {
      const { dateRange: _, ...filtersWithoutDate } = filters;
      console.log(_);
      onFiltersChange(filtersWithoutDate);
    }
  };

  const handleAmountRangeApply = () => {
    const min = Number.parseFloat(amountRange.min);
    const max = Number.parseFloat(amountRange.max);

    if (!isNaN(min) || !isNaN(max)) {
      updateFilters({
        amountRange: {
          min: isNaN(min) ? undefined : min,
          max: isNaN(max) ? undefined : max,
        },
      });
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status) count++;
    if (filters.orderType) count++;
    if (filters.customer) count++;
    if (filters.dateRange) count++;
    if (filters.amountRange) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="flex max-lg:mt-2 ml-auto flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-1">
        <Button
          variant={!filters.status ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilters({ status: undefined })}
        >
          All
        </Button>
        <Button
          variant={
            filters.status === ORDER_STATUS.PENDING ? "default" : "outline"
          }
          size="sm"
          onClick={() => updateFilters({ status: ORDER_STATUS.PENDING })}
        >
          Pending
        </Button>
        <Button
          variant={
            filters.status === ORDER_STATUS.PROCESSING ? "default" : "outline"
          }
          size="sm"
          onClick={() => updateFilters({ status: ORDER_STATUS.PROCESSING })}
        >
          Processing
        </Button>
        <Button
          variant={
            filters.status === ORDER_STATUS.COMPLETED ? "default" : "outline"
          }
          size="sm"
          onClick={() => updateFilters({ status: ORDER_STATUS.COMPLETED })}
        >
          Completed
        </Button>
        <Button
          variant={
            filters.status === ORDER_STATUS.CANCELLED ? "default" : "outline"
          }
          size="sm"
          onClick={() => updateFilters({ status: ORDER_STATUS.CANCELLED })}
        >
          Cancelled
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="relative bg-transparent"
          >
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Advanced Filters</h4>
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Order Type</Label>
              <Select
                value={filters.orderType || "all"}
                onValueChange={(value) =>
                  updateFilters({
                    orderType:
                      value === "all" ? undefined : (value as ORDER_TYPE),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
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
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateRangeChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Amount Range</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={amountRange.min}
                  onChange={(e) =>
                    setAmountRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={amountRange.max}
                  onChange={(e) =>
                    setAmountRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                />
              </div>
              <Button
                size="sm"
                onClick={handleAmountRangeApply}
                className="w-full"
              >
                Apply Range
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="w-4 h-4 mr-1" />
          Clear ({activeFilterCount})
        </Button>
      )}
    </div>
  );
}
