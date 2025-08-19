import {
  ChartDataPoint,
  ChartRange,
  type Order,
  ORDER_STATUS,
  type OrderFilters,
} from "../types";

export function getStatusColor(status: ORDER_STATUS): string {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case ORDER_STATUS.COMPLETED:
      return "bg-green-100 text-green-800 border-green-200";
    case ORDER_STATUS.CANCELLED:
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
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
      !order.customer.fullName
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
      case ORDER_STATUS.CANCELLED:
        stats.cancelled++;
        break;
      case ORDER_STATUS.COMPLETED:
        stats.completed++;
        break;
    }
  });

  return stats;
}

export interface ChartData {
  time: string;
  revenue: number;
}

export function mapChartData(
  chartData: ChartDataPoint[],
  range: ChartRange,
  fromDate?: string
): ChartData[] {
  const timeLabels = getLabelsForRange(range, fromDate);

  return chartData.map((point, index) => ({
    time: timeLabels[point.bucket] || timeLabels[index] || `${point.bucket}`,
    revenue: point.revenue,
  }));
}

function getLabelsForRange(range: ChartRange, fromDate?: string): string[] {
  const baseDate = fromDate ? new Date(fromDate) : new Date();

  switch (range) {
    case "1d": {
      return ["0:00", "4:00", "8:00", "12:00", "16:00", "20:00"];
    }
    case "7d": {
      const dayNames = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const startIndex = (baseDate.getDay() + 6) % 7;
      return Array.from(
        { length: 7 },
        (_, i) => dayNames[(startIndex + i) % 7]
      );
    }
    case "1m": {
      const year = baseDate.getFullYear();
      const month = baseDate.getMonth();
      const startDay = baseDate.getDate();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const labels: string[] = [];
      for (let i = 0; i < daysInMonth; i++) {
        const day = ((startDay - 1 + i) % daysInMonth) + 1;
        labels.push(String(day));
      }
      return labels;
    }
    case "1y": {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const startMonth = baseDate.getMonth();
      return Array.from(
        { length: 12 },
        (_, i) => monthNames[(startMonth + i) % 12]
      );
    }
    case "all":
      return [];
    default:
      return [];
  }
}
