"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/Navbar";
import { pusherClient, CHANNELS, EVENTS } from "@/lib/pusher-client";

interface OrderItemData {
  id: string;
  quantity: number;
  price: number;
  menuItem: { name: string };
}

interface KitchenOrder {
  id: string;
  status: "PENDING" | "PREPARING" | "SERVED" | "COMPLETED" | "CANCELLED";
  total: number;
  table: { number: number; capacity: number };
  items: OrderItemData[];
  createdAt: string;
}

function playBeep() {
  try {
    const audioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    const beep = (delay: number) => {
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      oscillator.connect(gain);
      gain.connect(audioCtx.destination);
      oscillator.frequency.value = 880;
      oscillator.type = "sine";
      gain.gain.value = 0.3;
      oscillator.start(audioCtx.currentTime + delay);
      oscillator.stop(audioCtx.currentTime + delay + 0.15);
    };
    beep(0);
    beep(0.25);
    beep(0.5);
  } catch {
    // Audio not available
  }
}

function getTimerColor(elapsed: number): string {
  if (elapsed >= 15 * 60 * 1000) return "text-red-600 font-bold";
  if (elapsed >= 8 * 60 * 1000) return "text-red-500 font-semibold";
  return "text-muted-foreground";
}

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function KitchenPage() {
  const t = useTranslations("Kitchen");
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const [loading, setLoading] = useState(true);

  // Fetch real orders from DB
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok || cancelled) return;
        const data: KitchenOrder[] = await res.json();
        if (!cancelled) {
          setOrders(data.filter((o) => !["COMPLETED", "CANCELLED"].includes(o.status)));
        }
      } catch {
        // silently ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Subscribe to Pusher for real-time kitchen events
  useEffect(() => {
    const channel = pusherClient.subscribe(CHANNELS.KITCHEN);

    channel.bind(EVENTS.NEW_ORDER, (newOrder: KitchenOrder) => {
      setOrders((prev) => {
        // Avoid duplicates
        if (prev.some((o) => o.id === newOrder.id)) return prev;
        return [newOrder, ...prev];
      });
      if (soundEnabled) playBeep();
    });

    channel.bind(EVENTS.ORDER_UPDATED, (updatedOrder: KitchenOrder) => {
      setOrders((prev) =>
        prev
          .map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
          .filter((o) => !["COMPLETED", "CANCELLED"].includes(o.status))
      );
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(CHANNELS.KITCHEN);
    };
  }, [soundEnabled]);

  // Update order status in DB via API
  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated: KitchenOrder = await res.json();
        setOrders((prev) =>
          prev
            .map((o) => (o.id === updated.id ? updated : o))
            .filter((o) => !["COMPLETED", "CANCELLED"].includes(o.status))
        );
      }
    } catch {
      // silently ignore
    }
  }

  async function cancelOrder(orderId: string) {
    await updateOrderStatus(orderId, "CANCELLED");
  }

  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const preparingOrders = orders.filter((o) => o.status === "PREPARING");
  const servedOrders = orders.filter((o) => o.status === "SERVED");

  const currentTime = new Date(now).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  if (loading) {
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

      {/* Kitchen Status Bar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-2">
        <div className="flex items-center gap-3">
          <span className="text-xl">🍳</span>
          <h1 className="text-lg font-bold">
            {t("title")}
          </h1>
          <span className="flex items-center gap-1.5 rounded-full border border-green-800 bg-green-900/30 px-3 py-0.5 text-xs font-medium text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {t("live")}
          </span>
        </div>
        <span className="text-sm font-medium text-muted-foreground">{currentTime}</span>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 border-b border-border bg-card px-6 py-4">
        <StatCard label={t("newOrders")} value={pendingOrders.length} />
        <StatCard label={t("cooking")} value={preparingOrders.length} />
        <StatCard label={t("ready")} value={servedOrders.length} />
        <StatCard label={t("servedToday")} value={orders.length} />
      </div>

      {/* Kanban Columns */}
      <div className="flex flex-1 gap-0 overflow-hidden">
        {/* PENDING */}
        <div className="flex flex-1 flex-col border-r border-border">
          <div className="bg-orange-900/20 px-5 py-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-orange-400">
              <span>🔔</span> {t("newOrders")}
            </h2>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {pendingOrders.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                {t("noOrders")}
              </p>
            )}
            {pendingOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                now={now}
                variant="pending"
                onAction={() => updateOrderStatus(order.id, "PREPARING")}
                onDismiss={() => cancelOrder(order.id)}
                t={t}
              />
            ))}
          </div>
        </div>

        {/* PREPARING */}
        <div className="flex flex-1 flex-col border-r border-border">
          <div className="bg-blue-900/20 px-5 py-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-blue-400">
              <span>🔥</span> {t("cooking")}
            </h2>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {preparingOrders.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                {t("nothingCooking")}
              </p>
            )}
            {preparingOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                now={now}
                variant="preparing"
                onAction={() => updateOrderStatus(order.id, "SERVED")}
                t={t}
              />
            ))}
          </div>
        </div>

        {/* SERVED */}
        <div className="flex flex-1 flex-col">
          <div className="bg-green-900/20 px-5 py-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-green-400">
              <span>✓</span> {t("readyToServe")}
            </h2>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {servedOrders.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                {t("noReady")}
              </p>
            )}
            {servedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                now={now}
                variant="served"
                onAction={() => updateOrderStatus(order.id, "COMPLETED")}
                t={t}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t border-border bg-card px-6 py-3">
        <span className="text-sm text-muted-foreground">
          🍽 {pendingOrders.length + preparingOrders.length + servedOrders.length} active orders
        </span>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`rounded border px-4 py-2 text-sm font-medium transition ${
            soundEnabled
              ? "border-border bg-card text-foreground hover:bg-accent"
              : "border-border bg-accent text-muted-foreground"
          }`}
        >
          🔔 {soundEnabled ? t("soundOn") : t("soundOff")}
        </button>
      </footer>
    </div>
  );
}

/* ---------- Stat Card ---------- */

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface-container px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-gold">{value}</p>
    </div>
  );
}

/* ---------- Order Card ---------- */

interface OrderCardProps {
  order: KitchenOrder;
  now: number;
  variant: "pending" | "preparing" | "served";
  onAction: () => void;
  onDismiss?: () => void;
  t: (key: string) => string;
}

const variantStyles = {
  pending: {
    border: "border-l-orange-500",
    badge: "bg-orange-900/30 text-orange-400",
    actionKey: "startCooking",
    actionIcon: "🔥",
  },
  preparing: {
    border: "border-l-blue-500",
    badge: "bg-blue-900/30 text-blue-400",
    actionKey: "markReady",
    actionIcon: "✓",
  },
  served: {
    border: "border-l-green-500",
    badge: "bg-green-900/30 text-green-400",
    actionKey: "served",
    actionIcon: "🍽",
  },
};

function OrderCard({ order, now, variant, onAction, onDismiss, t }: OrderCardProps) {
  const elapsed = now - new Date(order.createdAt).getTime();
  const timerColor = getTimerColor(elapsed);
  const styles = variantStyles[variant];

  return (
    <div
      className={`rounded border border-border border-l-4 ${styles.border} bg-card p-4 shadow-sm`}
    >
      {/* Card Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-md px-2 py-1 text-xs font-bold ${styles.badge}`}
          >
            {t("table")} {order.table.number}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            🤖 AI Waiter
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">#{order.id.slice(-6)}</span>
          <span className={`text-xs font-mono ${timerColor}`}>
            {formatElapsed(elapsed)}
          </span>
        </div>
      </div>

      {/* Items */}
      <ul className="mb-4 space-y-1">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-2 text-sm">
            <span className="font-medium text-muted-foreground">{item.quantity}×</span>
            <span>{item.menuItem.name}</span>
            <span className="ml-auto text-xs text-gold">€{(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      {/* Total */}
      <div className="mb-3 flex justify-between border-t border-border pt-2 text-sm">
        <span className="font-semibold">Total</span>
        <span className="font-bold text-gold">€{order.total.toFixed(2)}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAction}
          className="flex-1 rounded border border-gold/30 bg-gold-dark/20 px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold-dark/40 active:scale-95"
        >
          {styles.actionIcon} {t(styles.actionKey)}
        </button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="rounded border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-destructive"
          >
            ✕
          </button>
        )}
      </div>

      {/* Customer notified (only for served) */}
      {variant === "served" && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-green-400">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          {t("waiterNotified")}
        </div>
      )}
    </div>
  );
}
