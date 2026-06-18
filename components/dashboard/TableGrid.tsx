"use client";

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
}

interface TableGridProps {
  tables: Table[];
}

const statusColors: Record<string, string> = {
  AVAILABLE: "bg-green-100 border-green-300 text-green-800",
  OCCUPIED: "bg-red-100 border-red-300 text-red-800",
  RESERVED: "bg-yellow-100 border-yellow-300 text-yellow-800",
};

export function TableGrid({ tables }: TableGridProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="mb-4 font-semibold">Tables</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`flex flex-col items-center rounded-lg border p-3 ${statusColors[table.status]}`}
          >
            <span className="text-lg font-bold">T{table.number}</span>
            <span className="text-xs">{table.capacity} seats</span>
            <span className="mt-1 text-xs font-medium capitalize">
              {table.status.toLowerCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
