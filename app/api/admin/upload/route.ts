import { randomBytes } from "crypto";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/http";

export const runtime = "nodejs";

const types: Record<string, { ext: string; magic: number[] }> = {
  "image/jpeg": { ext: "jpg", magic: [0xff, 0xd8, 0xff] },
  "image/png": { ext: "png", magic: [0x89, 0x50, 0x4e, 0x47] },
  "image/webp": { ext: "webp", magic: [0x52, 0x49, 0x46, 0x46] },
};

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Görsel seçin." }, { status: 400 });
  const spec = types[file.type];
  if (!spec) return NextResponse.json({ error: "Yalnızca JPG, PNG veya WEBP yükleyin." }, { status: 400 });
  if (file.size > 2_000_000) return NextResponse.json({ error: "Görsel 2 MB'dan küçük olmalı." }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const magicOk = spec.magic.every((value, index) => bytes[index] === value);
  const webpOk = file.type !== "image/webp" || bytes.subarray(8, 12).toString("ascii") === "WEBP";
  if (!magicOk || !webpOk) return NextResponse.json({ error: "Dosya gerçek bir görsel değil." }, { status: 400 });

  const name = `${randomBytes(8).toString("hex")}.${spec.ext}`;
  const folder = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(folder, { recursive: true });
  await fs.writeFile(path.join(folder, name), bytes);
  return NextResponse.json({ url: `/uploads/${name}` });
}
