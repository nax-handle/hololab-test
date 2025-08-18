import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS } from "@/types/order";
import { getStatusColor } from "@/lib/order";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Package,
} from "lucide-react";

interface OrderStatusBadgeProps {
  status: ORDER_STATUS;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function OrderStatusBadge({
  status,
  showIcon = false,
  size = "md",
}: OrderStatusBadgeProps) {
  const getStatusIcon = (status: ORDER_STATUS) => {
    const iconSize =
      size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4";

    switch (status) {
      case ORDER_STATUS.PENDING:
        return <Clock className={iconSize} />;
      case ORDER_STATUS.CONFIRMED:
        return <CheckCircle className={iconSize} />;
      case ORDER_STATUS.IN_PROGRESS:
        return <RefreshCw className={iconSize} />;
      case ORDER_STATUS.COMPLETED:
        return <Package className={iconSize} />;
      case ORDER_STATUS.CANCELLED:
        return <XCircle className={iconSize} />;
      case ORDER_STATUS.REFUNDED:
        return <AlertCircle className={iconSize} />;
      default:
        return null;
    }
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <Badge
      className={`${getStatusColor(status)} ${
        sizeClasses[size]
      } flex items-center gap-1.5`}
    >
      {showIcon && getStatusIcon(status)}
      {status.replace("_", " ")}
    </Badge>
  );
}
