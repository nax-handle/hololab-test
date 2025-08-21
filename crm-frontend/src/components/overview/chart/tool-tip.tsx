import { ChartData, formatCurrency } from "@/lib/order";
import { CircleDollarSign } from "lucide-react";
import type { TooltipProps } from "recharts";

export function CustomTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as ChartData;
  return (
    <div className="rounded-md border bg-popover p-2 text-xs shadow">
      <div className="mb-1 text-muted-foreground">{item.value}</div>
      <div className="font-medium flex items-center ">
        <CircleDollarSign className="w-3 h-3  rounded-full text-green-500 mr-2" />
        Revenue: {formatCurrency(Number(item.revenue))}
      </div>
    </div>
  );
}
