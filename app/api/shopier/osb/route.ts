import { markPaidFromNotice } from "@/lib/store";
import { readShopierOsb, removeShopierProduct } from "@/lib/shopier";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const type = request.headers.get("content-type") || "";
  let res = "";
  let hash = "";
  try {
    if (type.includes("application/json")) {
      const body = (await request.json()) as { res?: unknown; hash?: unknown };
      res = typeof body.res === "string" ? body.res : "";
      hash = typeof body.hash === "string" ? body.hash : "";
    } else {
      const form = await request.formData();
      res = String(form.get("res") || "");
      hash = String(form.get("hash") || "");
    }
  } catch {
    return new Response("failure", { status: 400, headers: { "content-type": "text/plain" } });
  }

  try {
    const result = readShopierOsb(res, hash);
    if (!result.verified || !result.payload) {
      return new Response("failure", { status: 401, headers: { "content-type": "text/plain" } });
    }
    const notice = await markPaidFromNotice(
      JSON.stringify(result.payload),
      `osb:${result.payload.orderId || hash.slice(0, 24)}`,
      result.payload.orderId,
    );
    if (notice.ok && !notice.duplicate && notice.shopierProductId) {
      void removeShopierProduct(notice.shopierProductId).catch(() => undefined);
    }
    return new Response("success", { headers: { "content-type": "text/plain; charset=utf-8" } });
  } catch (error) {
    console.error("Shopier OSB rejected", error instanceof Error ? error.message : "unknown");
    return new Response("failure", { status: 401, headers: { "content-type": "text/plain" } });
  }
}
