import "server-only";
import { ShopierApiClient, ShopierOsbClient, ShopierPaymentFlow, verifyAndParseWebhook } from "@nopeion/shopier";
import type { Order } from "./types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80";

export function shopierStatus() {
  return {
    pat: Boolean(process.env.SHOPIER_PAT),
    slug: Boolean(process.env.SHOPIER_SHOP_SLUG),
    webhook: Boolean(process.env.SHOPIER_WEBHOOK_TOKEN),
    osb: Boolean(process.env.SHOPIER_OSB_USERNAME && process.env.SHOPIER_OSB_PASSWORD),
    ready: Boolean(process.env.SHOPIER_PAT && process.env.SHOPIER_SHOP_SLUG),
  };
}

function publicImage(order: Order) {
  return order.items.find((item) => /^https?:\/\//i.test(item.imageUrl))?.imageUrl || FALLBACK_IMAGE;
}

export async function createShopierCheckout(order: Order) {
  const pat = process.env.SHOPIER_PAT;
  const shopSlug = process.env.SHOPIER_SHOP_SLUG;
  if (!pat || !shopSlug) throw new Error("Shopier ayarları eksik");

  const client = new ShopierApiClient({ pat });
  const payments = new ShopierPaymentFlow({ client, shopSlug, autoDeleteProduct: false });
  const lines = order.items.map((item) => `${item.quantity} x ${item.name}`).join(", ");
  const description = [
    lines,
    `Sipariş no: ${order.id}`,
    `Teslimat: ${order.buyerName}, ${order.buyerPhone}, ${order.address}, ${order.city}`,
  ]
    .join("\n")
    .slice(0, 1000);

  const payment = await payments.createPaymentLink({
    title: `Sipariş ${order.id}`.slice(0, 100),
    description,
    customNote: order.id,
    amount: order.total.toFixed(2),
    currency: "TRY",
    imageUrl: publicImage(order),
    orderId: order.id,
    hostedCheckout: true,
    shopSlug,
    productType: "digital",
    shippingPayer: "sellerPays",
    stockQuantity: 1,
    customListing: true,
  });

  if (!payment.checkoutHtml) throw new Error("Shopier ödeme formu gelmedi");
  return { productId: payment.productId, html: payment.checkoutHtml };
}

export function readShopierWebhook(rawBody: string, headers: Headers) {
  const webhookToken = process.env.SHOPIER_WEBHOOK_TOKEN;
  if (!webhookToken) throw new Error("Webhook anahtarı yok");
  return verifyAndParseWebhook({ webhookToken, body: rawBody, headers });
}

export function readShopierOsb(res: string, hash: string) {
  const username = process.env.SHOPIER_OSB_USERNAME;
  const password = process.env.SHOPIER_OSB_PASSWORD;
  if (!username || !password) throw new Error("OSB bilgisi yok");
  return new ShopierOsbClient({ username, password }).handle({ res, hash });
}

export async function removeShopierProduct(productId: string) {
  const pat = process.env.SHOPIER_PAT;
  if (!pat || !productId) return;
  const client = new ShopierApiClient({ pat });
  await client.products.delete(productId);
}
