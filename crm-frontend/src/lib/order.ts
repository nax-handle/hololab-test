import { type Order, ORDER_STATUS, type OrderFilters } from "../types/order";

export function getStatusColor(status: ORDER_STATUS): string {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case ORDER_STATUS.COMPLETED:
      return "bg-green-100 text-green-800 border-green-200";
    case ORDER_STATUS.PROCESSING:
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function filterOrders(orders: Order[], filters: OrderFilters): Order[] {
  return orders.filter((order) => {
    if (filters.status && order.status !== filters.status) {
      return false;
    }

    if (filters.orderType && order.orderType !== filters.orderType) {
      return false;
    }

    if (
      filters.customer &&
      !order.customer.name
        .toLowerCase()
        .includes(filters.customer.toLowerCase())
    ) {
      return false;
    }

    if (filters.dateRange) {
      const orderDate = new Date(order.createdAt);
      if (
        orderDate < filters.dateRange.start ||
        orderDate > filters.dateRange.end
      ) {
        return false;
      }
    }

    if (filters.amountRange) {
      const { min, max } = filters.amountRange;
      if (min !== undefined && order.totalAmount < min) {
        return false;
      }
      if (max !== undefined && order.totalAmount > max) {
        return false;
      }
    }

    return true;
  });
}

export function getOrderStats(orders: Order[]) {
  const stats = {
    total: orders.length,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
    activeRevenue: 0,
  };

  orders.forEach((order) => {
    switch (order.status) {
      case ORDER_STATUS.PENDING:
        stats.pending++;
        break;
      case ORDER_STATUS.PROCESSING:
        stats.inProgress++;
        stats.activeRevenue += order.totalAmount;
        break;
      case ORDER_STATUS.COMPLETED:
        stats.completed++;
        stats.totalRevenue += order.totalAmount;
        break;
    }
  });

  return stats;
}
