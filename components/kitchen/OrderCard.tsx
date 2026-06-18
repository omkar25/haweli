"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  menuItem: { name: string; isVeg: boolean };
}

interface OrderCardProps {
  order: {
    id: string;
    status: string;
    createdAt: string;
    table: { number: number };
    items: OrderItem[];
  };
  onStatusChange: (orderId: string, status: string) => void;
}

export function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const timeSince = (date: string) => {
    const mins = Math.floor(
      (Date.now() - new Date(date).getTime()) / 60000
    );
    return mins < 1 ? "Just now" : `${mins}m ago`;
  };

  const nextStatus: Record<string, string> = {
    PENDING: "PREPARING",
    PREPARING: "SERVED",
    SERVED: "COMPLETED",
  };

  return (
    <Card className="mb-3">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold">
            Table {order.table.number}
          </CardTitle>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {timeSince(order.createdAt)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.menuItem.isVeg ? "🟢" : "🔴"} {item.menuItem.name}
              </span>
              <span className="font-medium">×{item.quantity}</span>
            </li>
          ))}
        </ul>
        {nextStatus[order.status] && (
          <button
            onClick={() => onStatusChange(order.id, nextStatus[order.status])}
            className="mt-3 w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            Mark as {nextStatus[order.status]}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
