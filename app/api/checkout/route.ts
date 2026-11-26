import { NextResponse } from "next/server";
import { attachShopierProduct, cancelPending, placeOrder } from "@/lib/store";
import { createShopierCheckout, shopierStatus } from "@/lib/shopier";
import { readCheckoutInput } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Sipariş bilgisi okunamadı." }, { status: 400 });
  }

  const parsed = readCheckoutInput(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  if (!shopierStatus().ready) {
    return NextResponse.json(
      { error: "Ödeme henüz açılmadı. Shopier anahtarı ve mağaza adı girilmeden sipariş alınamıyor." },
      { status: 503 },
    );
  }

  const placed = await placeOrder(parsed.value);
  if (!placed.ok) return NextResponse.json({ error: placed.error }, { status: 400 });

  try {
    const payment = await createShopierCheckout(placed.order);
    await attachShopierProduct(placed.order.id, payment.productId);
    return new NextResponse(payment.html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-order-id": placed.order.id,
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    await cancelPending(placed.order.id);
    console.error("Shopier checkout failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { error: "Shopier ödeme sayfası açılamadı. Anahtar ve mağaza adını kontrol edin." },
      { status: 502 },
    );
  }
}
