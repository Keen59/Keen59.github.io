import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export async function requireAdmin() {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: "Giriş gerekli." }, { status: 401 });
}
