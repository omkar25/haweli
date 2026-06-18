"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
}

export default function OrderPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const t = useTranslations("Order");

  useEffect(() => {
    async function fetchTables() {
      try {
        const res = await fetch("/api/tables");
        if (res.ok) {
          const data = await res.json();
          setTables(data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchTables();
  }, []);

  function handleSelectTable(tableNumber: number) {
    router.push(`/chat?table=${tableNumber}`);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-orange-50 to-white">
        <div className="text-center">
          <span className="text-4xl">🍛</span>
          <p className="mt-4 text-gray-500">{t("loading")}</p>
        </div>
      </div>
    );
  }

  const availableTables = tables.filter((t) => t.status === "AVAILABLE");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="px-6 py-8 text-center">
        <span className="text-5xl">🍛</span>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Haweli Restaurant</h1>
        <p className="mt-2 text-gray-600">{t("subtitle")}</p>
      </header>

      {/* Table Selection */}
      <main className="mx-auto w-full max-w-md px-6 pb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">{t("selectTable")}</h2>

        {availableTables.length === 0 ? (
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 text-center">
            <span className="text-3xl">😔</span>
            <p className="mt-2 font-medium text-orange-800">{t("noTables")}</p>
            <p className="mt-1 text-sm text-orange-600">{t("tryLater")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {availableTables.map((table) => (
              <button
                key={table.id}
                onClick={() => handleSelectTable(table.number)}
                className="flex flex-col items-center gap-2 rounded-xl border-2 border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-400 hover:shadow-md active:scale-95"
              >
                <span className="text-3xl">🪑</span>
                <span className="text-lg font-bold text-gray-900">
                  {t("table")} {table.number}
                </span>
                <span className="text-xs text-gray-500">
                  {table.capacity} {t("seats")}
                </span>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  {t("available")}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Show occupied tables (greyed out) */}
        {tables.filter((t) => t.status !== "AVAILABLE").length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-gray-400">{t("occupied")}</p>
            <div className="grid grid-cols-2 gap-3">
              {tables
                .filter((t) => t.status !== "AVAILABLE")
                .map((table) => (
                  <div
                    key={table.id}
                    className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-5 opacity-50"
                  >
                    <span className="text-3xl">🪑</span>
                    <span className="text-lg font-bold text-gray-400">
                      {t("table")} {table.number}
                    </span>
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                      {table.status === "OCCUPIED" ? t("inUse") : t("reserved")}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
