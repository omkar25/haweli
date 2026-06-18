"use client";

import { OrderCard } from "./OrderCard";

interface Order {
  id: string;
  status: string;
  createdAt: string;
  table: { number: number };
  items: {
    id: string;
    quantity: number;
    menuItem: { name: string; isVeg: boolean };
  }[];
}

interface KitchenColumnProps {
  title: string;
  orders: Order[];
  color: string;
  onStatusChange: (orderId: string, status: string) => void;
}

export function KitchenColumn({
  title,
  orders,
  color,
  onStatusChange,
}: KitchenColumnProps) {
  return (
    <div className="flex-1 rounded-lg border bg-card p-4">
      <div className="mb-4 flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${color}`} />
        <h2 className="font-semibold">{title}</h2>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
          {orders.length}
        </span>
      </div>
      <div className="space-y-2">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onStatusChange={onStatusChange}
          />
        ))}
        {orders.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No orders
          </p>
        )}
      </div>
    </div>
  );
}
