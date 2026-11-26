import Link from "next/link";
import { shopierStatus } from "@/lib/shopier";
import { listOrders, listProducts } from "@/lib/store";

export const metadata = { title: "Yönetim" };

export default function AdminHome() {
  const products = listProducts();
  const orders = listOrders();
  const pending = orders.filter((order) => order.status === "pending").length;
  const paid = orders.filter((order) => order.status === "paid").length;
  const shopier = shopierStatus();

  return (
    <div>
      <h1 className="font-serif text-5xl">Atölye özeti</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["Ürün", String(products.length), "/admin/urunler"],
          ["Ödeme bekleyen", String(pending), "/admin/siparisler"],
          ["Ödenen", String(paid), "/admin/siparisler"],
        ].map(([label, value, href]) => (
          <Link key={label} href={href} className="rounded-3xl border border-line bg-paper p-5">
            <p className="text-sm text-ink/60">{label}</p>
            <p className="mt-2 font-serif text-4xl">{value}</p>
          </Link>
        ))}
      </div>
      <p className={`mt-6 rounded-2xl px-4 py-3 text-sm ${shopier.ready ? "bg-moss/10 text-moss" : "bg-[#8c2d20]/10 text-[#8c2d20]"}`}>
        {shopier.ready
          ? "Shopier ödemesi açık."
          : "Shopier ödemesi kapalı. Anahtar ve mağaza adını .env.local dosyasına yazın."}
      </p>
    </div>
  );
}
