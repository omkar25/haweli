"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopDishes } from "@/components/dashboard/TopDishes";
import { TableGrid } from "@/components/dashboard/TableGrid";
import { Navbar } from "@/components/Navbar";
import { pusherClient, CHANNELS, EVENTS } from "@/lib/pusher-client";

interface Analytics {
  todayRevenue: number;
  totalOrdersToday: number;
  activeOrders: number;
  topDishes: { name: string; totalOrdered: number }[];
  tables: {
    id: string;
    number: number;
    capacity: number;
    status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
  }[];
}

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const [data, setData] = useState<Analytics | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics");
      if (!res.ok) return;
      const json = await res.json();
      setData(json);
    } catch {
      // DB not ready yet — silently ignore
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/analytics");
        if (!res.ok || cancelled) return;
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch {
        // silently ignore
      }
    }
    load();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [fetchAnalytics]);

  // Real-time: refresh dashboard when kitchen gets new/updated orders
  useEffect(() => {
    const channel = pusherClient.subscribe(CHANNELS.KITCHEN);
    channel.bind(EVENTS.NEW_ORDER, () => fetchAnalytics());
    channel.bind(EVENTS.ORDER_UPDATED, () => fetchAnalytics());
    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(CHANNELS.KITCHEN);
    };
  }, [fetchAnalytics]);

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">{t("title")}</h1>
        <div className="space-y-6">
          <RevenueChart
            revenue={data.todayRevenue}
            totalOrders={data.totalOrdersToday}
            activeOrders={data.activeOrders}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TopDishes dishes={data.topDishes} />
            <TableGrid tables={data.tables} />
          </div>
        </div>
      </div>
    </div>
  );
}
