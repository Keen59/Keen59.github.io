"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDate, formatTry } from "@/lib/format";
import type { Order } from "@/lib/types";

const labels: Record<Order["status"], string> = {
  pending: "Ödeme bekliyor",
  paid: "Ödendi",
  cancelled: "İptal",
};

export function AdminOrders({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState("");

  async function update(id: string, status: "paid" | "cancelled") {
    const message =
      status === "cancelled"
        ? "Sipariş iptal edilsin ve stok geri gelsin mi?"
        : "Bu sipariş Shopier panelinde ödendi olarak görünüyor mu?";
    if (!window.confirm(message)) return;
    setPendingId(id);
    setError("");
    const response = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    setPendingId("");
    if (!response.ok) {
      setError(data.error || "Sipariş güncellenemedi.");
      return;
    }
    router.refresh();
  }

  if (orders.length === 0) {
    return <p className="rounded-3xl border border-dashed border-line bg-paper px-6 py-12 text-ink/70">Henüz sipariş yok.</p>;
  }

  return (
    <div className="grid gap-4">
      <p className="max-w-3xl text-sm leading-6 text-ink/70">
        Ödeme başlayınca stok ayrılır. Shopier bildirimi gelince sipariş ödendi olur. Bildirim yerel adrese ulaşmazsa,
        ödemeyi Shopier panelinde gördükten sonra buradan işaretleyin. İptal edilen bekleyen siparişin stoğu geri gelir.
      </p>
      {error ? <p className="text-sm text-[#8c2d20]">{error}</p> : null}
      {orders.map((order) => (
        <article key={order.id} className="rounded-3xl border border-line bg-paper p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-serif text-2xl">{order.id}</p>
              <p className="text-sm text-ink/55">{formatDate(order.createdAt)}</p>
            </div>
            <span className="rounded-full bg-cream px-3 py-1 text-sm text-wood">{labels[order.status]}</span>
          </div>
          <ul className="mt-4 space-y-1 text-sm">
            {order.items.map((item) => (
              <li key={item.productId}>
                {item.quantity} × {item.name} · {formatTry(item.price)}
              </li>
            ))}
          </ul>
          <p className="mt-3 font-medium">Toplam {formatTry(order.total)}</p>
          <div className="mt-3 text-sm leading-6 text-ink/75">
            <p>{order.buyerName}</p>
            <p>{order.buyerPhone}</p>
            <p>{order.buyerEmail}</p>
            <p>
              {order.address}, {order.city}
            </p>
            {order.note ? <p>Not: {order.note}</p> : null}
          </div>
          {order.status === "pending" ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn btn-primary" type="button" disabled={pendingId === order.id} onClick={() => update(order.id, "paid")}>
                Ödendi olarak işaretle
              </button>
              <button className="btn btn-danger" type="button" disabled={pendingId === order.id} onClick={() => update(order.id, "cancelled")}>
                İptal et, stoğu geri al
              </button>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
