"use client";

import { useMemo, useState } from "react";
import { formatTry } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";

export function CheckoutForm({ products, shippingFee }: { products: Product[]; shippingFee: number }) {
  const { items, ready, clear, rememberOrder } = useCart();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    city: "",
    address: "",
    note: "",
  });

  const rows = useMemo(
    () =>
      items.map((item) => ({
        item,
        product: products.find((product) => product.id === item.productId && product.active),
      })),
    [items, products],
  );
  const goods = rows.reduce((sum, row) => sum + (row.product ? row.product.price * row.item.quantity : 0), 0);
  const blocked = !ready || rows.length === 0 || rows.some((row) => !row.product || row.item.quantity > (row.product?.stock || 0));

  function setField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (blocked || pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });
      const type = response.headers.get("content-type") || "";
      if (type.includes("text/html")) {
        const orderId = response.headers.get("x-order-id") || "";
        if (orderId) rememberOrder(orderId);
        clear();
        const html = await response.text();
        document.open();
        document.write(html);
        document.close();
        return;
      }
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Ödeme başlatılamadı.");
      setPending(false);
    } catch {
      setError("Bağlantı kurulamadı. Tekrar deneyin.");
      setPending(false);
    }
  }

  if (!ready) return <p>Ödeme sayfası hazırlanıyor...</p>;

  if (items.length === 0) {
    return <p className="text-ink/70">Sepet boş. Önce bir ürün ekleyin.</p>;
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
      <div className="grid gap-4 rounded-3xl border border-line bg-paper p-5">
        <label className="field">
          <span>Ad soyad</span>
          <input required value={form.buyerName} onChange={(event) => setField("buyerName", event.target.value)} />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="field">
            <span>E-posta</span>
            <input required type="email" value={form.buyerEmail} onChange={(event) => setField("buyerEmail", event.target.value)} />
          </label>
          <label className="field">
            <span>Telefon</span>
            <input required inputMode="tel" value={form.buyerPhone} onChange={(event) => setField("buyerPhone", event.target.value)} />
          </label>
        </div>
        <label className="field">
          <span>Şehir</span>
          <input required value={form.city} onChange={(event) => setField("city", event.target.value)} />
        </label>
        <label className="field">
          <span>Teslimat adresi</span>
          <textarea required value={form.address} onChange={(event) => setField("address", event.target.value)} />
        </label>
        <label className="field">
          <span>Sipariş notu</span>
          <textarea value={form.note} onChange={(event) => setField("note", event.target.value)} placeholder="Ölçü, renk ya da teslimat notu" />
        </label>
      </div>
      <aside className="h-fit rounded-3xl border border-line bg-cream p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-wood">Sipariş</p>
        <ul className="mt-4 space-y-3 text-sm">
          {rows.map(({ item, product }) => (
            <li key={item.productId} className="flex justify-between gap-3">
              <span>
                {item.quantity} × {product?.name || "Ürün yok"}
              </span>
              <span>{product ? formatTry(product.price * item.quantity) : "—"}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Kargo</dt>
            <dd>{shippingFee > 0 ? formatTry(shippingFee) : "Ücretsiz"}</dd>
          </div>
          <div className="flex justify-between font-serif text-2xl">
            <dt>Toplam</dt>
            <dd>{formatTry(goods + shippingFee)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm leading-6 text-ink/70">
          Adres bu siparişe kaydedilir. Kart ödemesi Shopier sayfasında alınır.
        </p>
        {error ? <p className="mt-3 text-sm text-[#8c2d20]">{error}</p> : null}
        <button type="submit" className="btn btn-primary mt-5 w-full" disabled={blocked || pending}>
          {pending ? "Shopier açılıyor..." : "Shopier ile öde"}
        </button>
      </aside>
    </form>
  );
}
