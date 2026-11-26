import { NextResponse } from "next/server";
import { markPaidFromNotice } from "@/lib/store";
import { readShopierWebhook, removeShopierProduct } from "@/lib/shopier";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const raw = await request.text();
  try {
    const event = readShopierWebhook(raw, request.headers);
    if (event.type !== "order.created") return NextResponse.json({ ok: true, ignored: true });

    const data = event.data as { id?: unknown };
    const shopierOrderId = typeof data?.id === "string" ? data.id : undefined;
    const result = await markPaidFromNotice(
      JSON.stringify(event.data),
      event.id || shopierOrderId || "",
      shopierOrderId,
    );
    if (result.ok && !result.duplicate && result.shopierProductId) {
      void removeShopierProduct(result.shopierProductId).catch((error: unknown) => {
        console.error("Shopier product cleanup failed", error instanceof Error ? error.message : "unknown");
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Shopier webhook rejected", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Bildirim doğrulanamadı." }, { status: 401 });
  }
}
