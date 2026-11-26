"use client";

import Link from "next/link";
import { formatTry } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";

export function CartView({
  products,
  shippingFee,
}: {
  products: Product[];
  shippingFee: number;
}) {
  const { items, ready, setQuantity, removeItem } = useCart();
  const rows = items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId && entry.active);
    return { item, product };
  });
  const goods = rows.reduce((sum, row) => sum + (row.product ? row.product.price * row.item.quantity : 0), 0);
  const blocked = rows.some((row) => !row.product || row.item.quantity > (row.product?.stock || 0));

  if (!ready) return <p className="text-ink/60">Sepet açılıyor...</p>;

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-paper px-6 py-16 text-center">
        <p className="font-serif text-3xl">Sepet boş.</p>
        <Link href="/urunler" className="btn btn-primary mt-6">
          Ürünlere bak
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <ul className="divide-y divide-line rounded-3xl border border-line bg-paper">
        {rows.map(({ item, product }) => (
          <li key={item.productId} className="flex gap-4 p-4">
            <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-bark">
              {product?.imageUrl ? <img src={product.imageUrl} alt="" className="h-full w-full object-cover" /> : null}
            </div>
            <div className="min-w-0 flex-1">
              {product ? (
                <Link href={`/urun/${product.slug}`} className="font-serif text-xl">
                  {product.name}
                </Link>
              ) : (
                <p className="font-serif text-xl">Bu ürün artık satılmıyor</p>
              )}
              <p className="mt-1 text-sm text-wood">{product ? formatTry(product.price) : "—"}</p>
              {product && item.quantity > product.stock ? (
                <p className="mt-1 text-sm text-[#8c2d20]">Stok {product.stock} adede düştü.</p>
              ) : null}
              <div className="mt-3 flex items-center gap-3">
                <input
                  className="w-20 rounded-lg border border-line bg-white px-2 py-1"
                  type="number"
                  min={1}
                  max={product ? Math.min(product.stock, 20) : 1}
                  value={item.quantity}
                  disabled={!product}
                  onChange={(event) => setQuantity(item.productId, Number(event.target.value), product?.stock || 0)}
                />
                <button type="button" className="text-sm text-ink/60 underline" onClick={() => removeItem(item.productId)}>
                  Çıkar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="h-fit rounded-3xl border border-line bg-cream p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-wood">Özet</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Ürünler</dt>
            <dd>{formatTry(goods)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Kargo</dt>
            <dd>{shippingFee > 0 ? formatTry(shippingFee) : "Ücretsiz"}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 font-serif text-2xl">
            <dt>Toplam</dt>
            <dd>{formatTry(goods + shippingFee)}</dd>
          </div>
        </dl>
        {blocked ? (
          <p className="mt-4 text-sm text-[#8c2d20]">Sepeti güncellemeden ödemeye geçilemez.</p>
        ) : (
          <Link href="/odeme" className="btn btn-primary mt-5 w-full">
            Teslimat ve ödeme
          </Link>
        )}
      </aside>
    </div>
  );
}
