"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LocaleSelector } from "@/components/LocaleSelector";

const NAV_LINKS = [
  { href: "/dashboard", labelKey: "dashboard" },
  { href: "/kitchen", labelKey: "kitchen" },
  { href: "/order", labelKey: "order" },
  { href: "/dashboard/qr", labelKey: "qr" },
  { href: "/chat", labelKey: "chat" },
];

export function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("Nav");

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <span>🍛</span>
          Haweli Restaurant
        </Link>
        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, labelKey }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {t(labelKey)}
              </Link>
            );
          })}
        </div>
      </div>
      <LocaleSelector />
    </nav>
  );
}
