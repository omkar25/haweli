"use client";

interface TopDishesProps {
  dishes: { name: string; totalOrdered: number }[];
}

export function TopDishes({ dishes }: TopDishesProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="mb-4 font-semibold">Top Dishes</h3>
      {dishes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No orders yet</p>
      ) : (
        <ul className="space-y-3">
          {dishes.map((dish, i) => (
            <li key={dish.name} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                {dish.name}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {dish.totalOrdered} orders
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
