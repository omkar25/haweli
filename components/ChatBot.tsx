"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { pusherClient, CHANNELS, EVENTS } from "@/lib/pusher-client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface TableInfo {
  id: string;
  number: number;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
}

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Invoice {
  orderId: string;
  table: number;
  items: InvoiceItem[];
  total: number;
  createdAt: string;
}

export function ChatBot() {
  const t = useTranslations("Chat");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [autoOpened, setAutoOpened] = useState(false);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [tableConfirmed, setTableConfirmed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Keep the greeting visible on first open; only auto-scroll once the
    // conversation has progressed beyond the initial welcome message.
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Auto-open chatbot after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!autoOpened) {
        setIsOpen(true);
        setAutoOpened(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [autoOpened]);

  // Fetch tables when chatbot opens
  useEffect(() => {
    if (isOpen && tables.length === 0) {
      fetch("/api/tables")
        .then((res) => res.json())
        .then((data) => setTables(data))
        .catch(() => {});
    }
  }, [isOpen, tables.length]);

  const sendMessage = useCallback(
    async (text: string, showInChat = true) => {
      if (showInChat) {
        setMessages((prev) => [...prev, { role: "user", content: text }]);
      }
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, sessionId }),
        });
        const data = await res.json();
        if (data.sessionId) setSessionId(data.sessionId);

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);

        if (data.invoice) {
          setInvoice(data.invoice);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, something went wrong. Please try again." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [sessionId]
  );

  // Show welcome message when opened
  useEffect(() => {
    if (isOpen && !initialized.current) {
      initialized.current = true;
      setMessages([
        {
          role: "assistant",
          content: t("welcomeMessage"),
        },
      ]);
    }
  }, [isOpen, t]);

  function handleTableConfirm() {
    if (!selectedTable || loading) return;
    setTableConfirmed(true);
    sendMessage(`Table ${selectedTable}`);
  }

  function handleSend() {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    sendMessage(userMessage);
  }

  function handleNewChat() {
    setMessages([]);
    setSessionId(null);
    setInvoice(null);
    setSelectedTable(null);
    setTableConfirmed(false);
    setTables([]);
    initialized.current = false;
    // Re-trigger
    setTimeout(() => {
      initialized.current = true;
      setMessages([
        {
          role: "assistant",
          content: t("welcomeMessage"),
        },
      ]);
      fetch("/api/tables")
        .then((res) => res.json())
        .then((data) => setTables(data))
        .catch(() => {});
    }, 100);
  }

  // Listen for order-ready notification from kitchen
  useEffect(() => {
    const channel = pusherClient.subscribe(CHANNELS.ORDERS);
    channel.bind(
      EVENTS.ORDER_READY,
      (data: { orderId: string; tableNumber: number; message: string }) => {
        // Only show if it's for the selected table
        if (selectedTable && data.tableNumber === selectedTable) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.message },
          ]);
        }
      }
    );
    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(CHANNELS.ORDERS);
    };
  }, [selectedTable]);

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="gold-glow fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold-dim text-on-primary shadow-lg transition hover:scale-105 hover:bg-gold"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[640px] w-[380px] flex-col overflow-hidden rounded-xl border border-outline-variant/30 bg-surface shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-outline-variant/20 bg-surface-container px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="brass-gradient flex h-9 w-9 items-center justify-center rounded-full">
                <span className="text-sm">🍛</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gold">Haweli</p>
                <p className="text-xs text-on-surface-variant/60">{t("aiWaiterStatus")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNewChat}
                className="rounded p-1.5 text-on-surface-variant/60 transition hover:bg-surface-container-high hover:text-gold"
                title={t("newConversation")}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1.5 text-on-surface-variant/60 transition hover:bg-surface-container-high hover:text-gold"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto bg-surface-dim p-3 space-y-3">
            {/* Date badge */}
            <div className="flex justify-center">
              <span className="rounded bg-surface-container-high px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-on-surface-variant/60">
                {t("today")}
              </span>
            </div>

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative max-w-[85%] rounded p-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gold-dark/60 text-gold"
                      : "border border-outline-variant/20 bg-surface-container text-on-surface"
                  }`}
                >
                  {msg.role === "assistant" && i === 0 && (
                    <p className="mb-1 font-heading text-sm font-medium italic text-gold">
                      {t("namaste")}
                    </p>
                  )}
                  <span className="whitespace-pre-wrap">
                    {msg.content}
                  </span>
                  <p className="mt-1 text-right text-[10px] text-on-surface-variant/40">
                    {timeString}
                  </p>
                </div>
              </div>
            ))}

            {/* Interactive table selection card */}
            {tables.length > 0 && !tableConfirmed && (
              <div className="rounded border border-outline-variant/20 bg-surface-container p-3">
                <div className="grid grid-cols-2 gap-2">
                  {tables.map((table) => {
                    const isAvailable = table.status === "AVAILABLE";
                    const isSelected = selectedTable === table.number;
                    return (
                      <button
                        key={table.id}
                        disabled={!isAvailable || loading}
                        onClick={() => isAvailable && setSelectedTable(table.number)}
                        className={`flex flex-col items-center gap-1 rounded border p-3 transition ${
                          !isAvailable
                            ? "cursor-not-allowed border-outline-variant/10 bg-surface-container-high opacity-40"
                            : isSelected
                              ? "border-gold bg-gold-dark/40 text-gold"
                              : "border-outline-variant/20 bg-surface-container-high text-on-surface hover:border-gold/40"
                        }`}
                      >
                        <span className="text-xl">🪑</span>
                        <span
                          className={`text-xs font-bold ${
                            isSelected
                              ? "text-gold"
                              : isAvailable
                                ? "text-on-surface"
                                : "text-on-surface-variant/40"
                          }`}
                        >
                          {t("tableLabel")} {String(table.number).padStart(2, "0")}
                        </span>
                        <span
                          className={`text-[10px] ${
                            isSelected
                              ? "text-gold/70"
                              : isAvailable
                                ? "text-on-surface-variant/60"
                                : "text-on-surface-variant/30"
                          }`}
                        >
                          {isAvailable ? `${table.capacity} ${t("seats")}` : t("occupied")}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleTableConfirm}
                  disabled={!selectedTable || loading}
                  className="brass-gradient mt-3 w-full rounded py-2.5 text-sm font-semibold text-on-primary transition hover:brightness-110 disabled:opacity-40"
                >
                  {t("confirmSelection")}
                </button>
              </div>
            )}

            {/* Invoice card */}
            {invoice && (
              <div className="rounded border border-gold/20 bg-gold-dark/20 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gold">🧾 {t("orderInvoice")}</h3>
                  <span className="text-xs text-gold/60">#{invoice.orderId.slice(-6)}</span>
                </div>
                <div className="space-y-1.5">
                  {invoice.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-on-surface-variant">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium text-gold">€{item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between border-t border-gold/20 pt-2">
                  <span className="text-sm font-bold text-gold">{t("total")}</span>
                  <span className="text-sm font-bold text-gold">€{invoice.total.toFixed(2)}</span>
                </div>
                <p className="mt-2 text-center text-xs text-on-surface-variant/60">
                  {t("orderConfirmed")}
                </p>
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded border border-outline-variant/20 bg-surface-container px-4 py-2.5 text-sm text-gold/60">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="border-t border-outline-variant/20 bg-surface-container px-3 py-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={tableConfirmed ? t("typeMessage") : t("selectTableFirst")}
                disabled={!tableConfirmed}
                className="flex-1 rounded border-0 bg-surface-container-high px-4 py-2.5 text-sm text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-gold/40 disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={loading || !input.trim() || !tableConfirmed}
                className="brass-gradient flex h-10 w-10 items-center justify-center rounded text-on-primary transition hover:brightness-110 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
