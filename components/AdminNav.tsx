"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  ["/admin", "Özet"],
  ["/admin/urunler", "Ürünler"],
  ["/admin/siparisler", "Siparişler"],
  ["/admin/ayarlar", "Ayarlar"],
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/giris");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <nav className="flex flex-wrap gap-2">
        {links.map(([href, label]) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-full px-3 py-1.5 text-sm ${active ? "bg-bark text-cream" : "border border-line bg-paper"}`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="flex gap-2">
        <Link href="/" className="btn btn-ghost px-3 py-2 text-sm">
          Siteyi gör
        </Link>
        <button type="button" className="btn btn-ghost px-3 py-2 text-sm" onClick={logout}>
          Çıkış
        </button>
      </div>
    </div>
  );
}
