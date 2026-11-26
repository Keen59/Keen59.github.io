import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderWatcher } from "@/components/OrderWatcher";
import { formatDate, formatTry } from "@/lib/format";
import { getOrder } from "@/lib/store";

type Props = { params: Promise<{ id: string }> };

const labels = {
  pending: "Ödeme bekleniyor",
  paid: "Ödeme alındı",
  cancelled: "Sipariş iptal edildi",
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Sipariş ${id}` };
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <OrderWatcher status={order.status} />
      <p className="text-xs uppercase tracking-[0.22em] text-wood">Sipariş</p>
      <h1 className="mt-2 font-serif text-4xl md:text-5xl">{order.id}</h1>
      <p className="mt-3 text-sm text-ink/55">{formatDate(order.createdAt)}</p>
      <p className="mt-6 rounded-2xl bg-cream px-4 py-3 text-wood">{labels[order.status]}</p>
      {order.status === "pending" ? (
        <p className="mt-3 text-sm leading-6 text-ink/70">
          Ödeme Shopier'da tamamlanınca bu sayfa güncellenir. Sayfayı kapatırsanız bu adresten tekrar bakabilirsiniz.
        </p>
      ) : null}
      <ul className="mt-8 divide-y divide-line rounded-3xl border border-line bg-paper">
        {order.items.map((item) => (
          <li key={item.productId} className="flex justify-between gap-4 px-4 py-3 text-sm">
            <span>
              {item.quantity} × {item.name}
            </span>
            <span>{formatTry(item.price * item.quantity)}</span>
          </li>
        ))}
        <li className="flex justify-between px-4 py-3 text-sm">
          <span>Kargo</span>
          <span>{order.shippingFee > 0 ? formatTry(order.shippingFee) : "Ücretsiz"}</span>
        </li>
        <li className="flex justify-between px-4 py-4 font-serif text-2xl">
          <span>Toplam</span>
          <span>{formatTry(order.total)}</span>
        </li>
      </ul>
      <div className="mt-6 text-sm leading-6 text-ink/75">
        <p>{order.buyerName}</p>
        <p>
          {order.address}, {order.city}
        </p>
      </div>
      <Link href="/urunler" className="btn btn-ghost mt-8">
        Vitrine dön
      </Link>
    </div>
  );
}
