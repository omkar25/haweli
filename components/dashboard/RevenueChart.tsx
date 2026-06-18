"use client";

interface RevenueChartProps {
  revenue: number;
  totalOrders: number;
  activeOrders: number;
}

export function RevenueChart({
  revenue,
  totalOrders,
  activeOrders,
}: RevenueChartProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">Today&apos;s Revenue</p>
        <p className="text-3xl font-bold">₹{revenue.toLocaleString()}</p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">Total Orders</p>
        <p className="text-3xl font-bold">{totalOrders}</p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">Active Orders</p>
        <p className="text-3xl font-bold text-orange-500">{activeOrders}</p>
      </div>
    </div>
  );
}
