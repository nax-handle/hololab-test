import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ORDER_STATUS } from "@/types/order";
import { CheckCircle, Circle, Clock, XCircle } from "lucide-react";
import { formatDate } from "@/lib/order";

interface StatusEvent {
  status: ORDER_STATUS;
  timestamp: Date;
  note?: string;
  user?: string;
}

interface OrderStatusTimelineProps {
  currentStatus: ORDER_STATUS;
  statusHistory?: StatusEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export function OrderStatusTimeline({
  currentStatus,
  createdAt,
  updatedAt,
}: OrderStatusTimelineProps) {
  const defaultTimeline: { status: ORDER_STATUS; label: string }[] = [
    { status: ORDER_STATUS.PENDING, label: "Order Received" },
    { status: ORDER_STATUS.PROCESSING, label: "Order Processing" },
    { status: ORDER_STATUS.COMPLETED, label: "Order Completed" },
  ];

  const getStatusIndex = (status: ORDER_STATUS) => {
    return defaultTimeline.findIndex((item) => item.status === status);
  };

  const currentIndex = getStatusIndex(currentStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {defaultTimeline.map((item, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={item.status} className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : isCurrent ? (
                    <Clock className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                  {index < defaultTimeline.length - 1 && (
                    <div
                      className={`w-px h-8 mt-2 ${
                        isCompleted ? "bg-green-200" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm font-medium ${
                        isCompleted
                          ? "text-green-900"
                          : isCurrent
                          ? "text-blue-900"
                          : "text-gray-500"
                      }`}
                    >
                      {item.label}
                    </p>
                    {isCompleted && (
                      <span className="text-xs text-gray-500">
                        {index === 0
                          ? formatDate(createdAt)
                          : formatDate(updatedAt)}
                      </span>
                    )}
                  </div>
                  {isCurrent && (
                    <p className="text-xs text-blue-600 mt-1">Current status</p>
                  )}
                </div>
              </div>
            );
          })}
          {currentStatus === ORDER_STATUS.CANCELLED && (
            <div className="flex items-start space-x-3 pt-2 border-t">
              <div className="flex flex-col items-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-red-900">
                    Order Cancelled
                  </p>
                  <span className="text-xs text-gray-500">
                    {formatDate(updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
