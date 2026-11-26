import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/http";
import { updateSettings } from "@/lib/store";
import { readSettingsInput } from "@/lib/validators";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = readSettingsInput(await request.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const settings = await updateSettings(parsed.value);
  return NextResponse.json({ settings });
}
