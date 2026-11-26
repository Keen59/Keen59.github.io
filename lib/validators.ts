import type { CheckoutInput, ProductInput } from "./types";
import { money } from "./format";

export function asText(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export function asBlock(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n/g, "\n").trim().slice(0, max);
}

export function parsePrice(value: unknown) {
  if (typeof value === "number") return money(value);
  if (typeof value !== "string") return Number.NaN;
  const trimmed = value.trim().replace(/\s/g, "");
  let normalized = trimmed;
  if (trimmed.includes(",") && trimmed.includes(".")) {
    normalized = trimmed.replace(/\./g, "").replace(",", ".");
  } else if (trimmed.includes(",")) {
    normalized = trimmed.replace(",", ".");
  }
  return money(Number(normalized));
}

export function cleanImageUrl(value: unknown) {
  const raw = asText(value, 500);
  if (!raw) return "";
  if (raw.startsWith("/uploads/")) {
    if (raw.includes("..") || raw.includes("\\")) return "";
    return raw;
  }
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

export function readProductInput(body: unknown): { ok: true; value: ProductInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Ürün bilgisi okunamadı." };
  const source = body as Record<string, unknown>;
  const name = asText(source.name, 120);
  const description = asBlock(source.description, 4000);
  const price = parsePrice(source.price);
  const stock = Number(source.stock);
  const imageUrl = cleanImageUrl(source.imageUrl);
  const active = source.active !== false;

  if (name.length < 2) return { ok: false, error: "Ürün adı en az 2 karakter olmalı." };
  if (!Number.isFinite(price) || price <= 0 || price > 10_000_000) {
    return { ok: false, error: "Geçerli bir fiyat girin." };
  }
  if (!Number.isInteger(stock) || stock < 0 || stock > 100000) {
    return { ok: false, error: "Stok tam sayı olmalı." };
  }
  if (asText(source.imageUrl, 500) && !imageUrl) {
    return { ok: false, error: "Görsel adresi http, https veya yüklenen dosya olmalı." };
  }

  return { ok: true, value: { name, description, price, imageUrl, stock, active } };
}

export function readCheckoutInput(body: unknown): { ok: true; value: CheckoutInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Sipariş bilgisi okunamadı." };
  const source = body as Record<string, unknown>;
  const buyerName = asText(source.buyerName, 80);
  const buyerEmail = asText(source.buyerEmail, 120).toLowerCase();
  const buyerPhone = asText(source.buyerPhone, 20);
  const address = asBlock(source.address, 300);
  const city = asText(source.city, 60);
  const note = asBlock(source.note, 500);
  const rawItems = Array.isArray(source.items) ? source.items : [];

  if (buyerName.length < 3) return { ok: false, error: "Ad soyad girin." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerEmail)) return { ok: false, error: "Geçerli bir e-posta girin." };
  const digits = buyerPhone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return { ok: false, error: "Geçerli bir telefon girin." };
  if (address.length < 8) return { ok: false, error: "Teslimat adresini yazın." };
  if (city.length < 2) return { ok: false, error: "Şehir girin." };
  if (rawItems.length < 1 || rawItems.length > 30) return { ok: false, error: "Sepet boş veya çok kalabalık." };

  const items = rawItems.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      productId: asText(row.productId, 40),
      quantity: Number(row.quantity),
    };
  });

  for (const item of items) {
    if (!item.productId) return { ok: false, error: "Sepette tanımsız ürün var." };
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
      return { ok: false, error: "Adet 1 ile 20 arasında olmalı." };
    }
  }

  return {
    ok: true,
    value: { items, buyerName, buyerEmail, buyerPhone, address, city, note },
  };
}

export function readSettingsInput(body: unknown) {
  if (!body || typeof body !== "object") return { ok: false as const, error: "Ayarlar okunamadı." };
  const source = body as Record<string, unknown>;
  const shopName = asText(source.shopName, 80);
  const tagline = asText(source.tagline, 160);
  const phone = asText(source.phone, 30);
  const email = asText(source.email, 120);
  const address = asBlock(source.address, 300);
  const about = asBlock(source.about, 2000);
  const shippingFee = parsePrice(source.shippingFee ?? 0);

  if (shopName.length < 2) return { ok: false as const, error: "Dükkan adı girin." };
  if (!Number.isFinite(shippingFee) || shippingFee < 0 || shippingFee > 100000) {
    return { ok: false as const, error: "Kargo ücreti geçersiz." };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false as const, error: "E-posta geçersiz." };
  }

  return {
    ok: true as const,
    value: { shopName, tagline, phone, email, address, about, shippingFee },
  };
}
