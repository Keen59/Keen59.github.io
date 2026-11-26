import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { getSettings } from "@/lib/store";
import "./globals.css";

const serif = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
});

const sans = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return {
    title: {
      default: settings.shopName,
      template: `%s · ${settings.shopName}`,
    },
    description: settings.tagline,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${serif.variable} ${sans.variable} font-sans text-ink antialiased`}>{children}</body>
    </html>
  );
}
