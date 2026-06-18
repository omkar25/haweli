"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export const CURRENCIES = {
  EUR: { symbol: "€", code: "EUR", name: "Euro", rate: 1, flag: "\uD83C\uDDEA\uD83C\uDDFA" },
  USD: { symbol: "$", code: "USD", name: "US Dollar", rate: 1.09, flag: "\uD83C\uDDFA\uD83C\uDDF8" },
  INR: { symbol: "₹", code: "INR", name: "Indian Rupee", rate: 91.5, flag: "\uD83C\uDDEE\uD83C\uDDF3" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (priceInEur: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("EUR");

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    if (typeof window !== "undefined") {
      localStorage.setItem("bella-currency", c);
    }
  }, []);

  const formatPrice = useCallback(
    (priceInEur: number) => {
      const converted = priceInEur * CURRENCIES[currency].rate;
      const { symbol } = CURRENCIES[currency];
      if (currency === "INR") {
        return `${symbol}${Math.round(converted)}`;
      }
      return `${symbol}${converted.toFixed(2)}`;
    },
    [currency]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
