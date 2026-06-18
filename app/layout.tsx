import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { CurrencyProvider } from "@/lib/currency-context";
import { ChatBot } from "@/components/ChatBot";
import { Nunito_Sans } from "next/font/google";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Haweli Restaurant — Royal Indian Gastronomy",
  description: "Authentic Indian cuisine with AI-powered ordering",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={nunitoSans.variable} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CurrencyProvider>
            {children}
            <ChatBot />
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
