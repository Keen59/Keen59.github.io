import Link from "next/link";
import type { Settings } from "@/lib/types";

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="mt-16 border-t border-line bg-bark text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-serif text-2xl">{settings.shopName}</p>
          <p className="mt-2 max-w-sm text-sm text-cream/75">{settings.tagline}</p>
        </div>
        <div className="text-sm text-cream/80">
          <p className="text-xs uppercase tracking-[0.18em] text-brass">Atölye</p>
          {settings.address ? <p className="mt-2 whitespace-pre-line">{settings.address}</p> : <p className="mt-2">Adres henüz yazılmadı.</p>}
          {settings.phone ? <p className="mt-2">{settings.phone}</p> : null}
          {settings.email ? <p>{settings.email}</p> : null}
        </div>
        <div className="text-sm text-cream/80">
          <p className="text-xs uppercase tracking-[0.18em] text-brass">Ödeme</p>
          <p className="mt-2">Kart ödemesi Shopier üzerinden alınır. Sipariş ve ürünler bu sitede durur.</p>
          <Link href="/admin" className="mt-4 inline-block text-cream/60 underline decoration-white/20 underline-offset-4">
            Yönetim
          </Link>
        </div>
      </div>
    </footer>
  );
}
