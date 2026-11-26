import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/http";
import { createProduct } from "@/lib/store";
import { readProductInput } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = readProductInput(await request.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const product = await createProduct(parsed.value);
  return NextResponse.json({ product }, { status: 201 });
}
