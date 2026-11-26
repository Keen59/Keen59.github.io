import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/http";
import { cancelPending, markPendingPaid } from "@/lib/store";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { status?: unknown } | null;
  const status = body?.status;
  if (status !== "paid" && status !== "cancelled") {
    return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
  }
  const order = status === "paid" ? await markPendingPaid(id) : await cancelPending(id);
  if (!order) return NextResponse.json({ error: "Yalnızca bekleyen sipariş güncellenebilir." }, { status: 409 });
  return NextResponse.json({ order });
}
