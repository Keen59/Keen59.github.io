"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export function Header({ shopName, phone }: { shopName: string; phone: string }) {
  const { count, lastOrderId } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3 text-ink">
          <svg viewBox="0 0 32 32" className="h-9 w-9 text-wood" aria-hidden>
            <rect x="1.5" y="1.5" width="29" height="29" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M7 23 L16 8 L25 23" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M11 23 H21" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <span className="font-serif text-xl leading-none md:text-2xl">{shopName}</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm md:gap-5">
          {phone ? (
            <a className="hidden text-ink/70 md:inline" href={`tel:${phone.replace(/\s/g, "")}`}>
              {phone}
            </a>
          ) : null}
          <Link href="/urunler" className="px-2 py-1">
            Ürünler
          </Link>
          <Link href="/sepet" className="rounded-full bg-bark px-3 py-1.5 text-cream">
            Sepet{count > 0 ? ` (${count})` : ""}
          </Link>
        </nav>
      </div>
      {lastOrderId ? (
        <div className="border-t border-line/80 bg-cream px-4 py-2 text-center text-sm">
          <Link href={`/siparis/${lastOrderId}`} className="underline decoration-brass underline-offset-4">
            Son siparişiniz: {lastOrderId}
          </Link>
        </div>
      ) : null}
    </header>
  );
}
