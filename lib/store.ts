import "server-only";
import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import type { CheckoutInput, Database, Order, Product, ProductInput, Settings } from "./types";
import { money, slugify } from "./format";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "store.json");

const defaultSettings: Settings = {
  shopName: "Marangoz Atölyesi",
  tagline: "Masif ahşap, atölyeden kapınıza.",
  phone: "",
  email: "",
  address: "",
  about:
    "Küçük bir atölyede, masif ahşabı tek tek işliyoruz. Vitrindeki parçalar hazır; ölçü ve ağaç türü için sipariş notuna yazmanız yeterli.",
  shippingFee: 0,
};

function seed(): Database {
  const now = new Date().toISOString();
  return {
    settings: defaultSettings,
    seenEvents: [],
    orders: [],
    products: [
      {
        id: "p-masa",
        name: "Meşe yemek masası",
        slug: "mese-yemek-masasi",
        description:
          "Düz çizgili, 180 × 90 cm meşe masa. Ayaklar geçmeli birleşir; yüzeyi mat yağ ile korunur. Altı kişi rahat oturur.",
        price: 24500,
        imageUrl:
          "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1400&q=80",
        stock: 2,
        active: true,
        createdAt: now,
      },
      {
        id: "p-sehpa",
        name: "Ceviz yan sehpa",
        slug: "ceviz-yan-sehpa",
        description:
          "Koltuk yanına oturan, tek çekmeceli ceviz sehpa. Üst tabla 45 cm, yükseklik 52 cm. Çekmece elle takılır.",
        price: 4800,
        imageUrl:
          "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1400&q=80",
        stock: 4,
        active: true,
        createdAt: now,
      },
      {
        id: "p-tahta",
        name: "Ceviz kesme tahtası",
        slug: "ceviz-kesme-tahtasi",
        description:
          "Kalın ceviz bloktan kesme tahtası. Kenarında oluk ve asmak için deri ip var. Gıda ile temas eden yüzey yağlanır.",
        price: 950,
        imageUrl: "",
        stock: 12,
        active: true,
        createdAt: now,
      },
      {
        id: "p-raf",
        name: "Meşe duvar rafı",
        slug: "mese-duvar-rafi",
        description:
          "90 cm meşe raf ve iki gizli taşıyıcı. Kitap, seramik ve küçük çerçeveler için. Duvar dübeli pakete dahildir.",
        price: 1750,
        imageUrl:
          "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=1400&q=80",
        stock: 7,
        active: true,
        createdAt: now,
      },
    ],
  };
}

function write(db: Database) {
  fs.mkdirSync(dataDir, { recursive: true });
  const tmp = `${dataFile}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.copyFileSync(tmp, dataFile);
  fs.rmSync(tmp, { force: true });
}

function ensure() {
  if (fs.existsSync(dataFile)) return;
  write(seed());
}

function read(): Database {
  ensure();
  const parsed = JSON.parse(fs.readFileSync(dataFile, "utf8")) as Database;
  if (!parsed.settings) parsed.settings = defaultSettings;
  if (!Array.isArray(parsed.products)) parsed.products = [];
  if (!Array.isArray(parsed.orders)) parsed.orders = [];
  if (!Array.isArray(parsed.seenEvents)) parsed.seenEvents = [];
  return parsed;
}

let chain: Promise<unknown> = Promise.resolve();

function update<T>(fn: (db: Database) => T): Promise<T> {
  const run = chain.then(() => {
    const db = read();
    const result = fn(db);
    write(db);
    return result;
  });
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function uniqueSlug(db: Database, name: string, currentId?: string) {
  const base = slugify(name);
  let slug = base;
  let n = 2;
  while (db.products.some((product) => product.slug === slug && product.id !== currentId)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

export function getSettings() {
  return read().settings;
}

export function listProducts() {
  return read()
    .products.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listActiveProducts() {
  return listProducts().filter((product) => product.active);
}

export function getProductBySlug(slug: string) {
  return read().products.find((product) => product.slug === slug) || null;
}

export function listOrders() {
  return read()
    .orders.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getOrder(id: string) {
  return read().orders.find((order) => order.id === id) || null;
}

export function createProduct(input: ProductInput) {
  return update((db) => {
    const product: Product = {
      id: `p-${randomBytes(4).toString("hex")}`,
      name: input.name,
      slug: uniqueSlug(db, input.name),
      description: input.description,
      price: input.price,
      imageUrl: input.imageUrl,
      stock: input.stock,
      active: input.active,
      createdAt: new Date().toISOString(),
    };
    db.products.push(product);
    return product;
  });
}

export function updateProduct(id: string, input: ProductInput) {
  return update((db) => {
    const product = db.products.find((item) => item.id === id);
    if (!product) return null;
    product.name = input.name;
    product.slug = uniqueSlug(db, input.name, product.id);
    product.description = input.description;
    product.price = input.price;
    product.imageUrl = input.imageUrl;
    product.stock = input.stock;
    product.active = input.active;
    return product;
  });
}

export function deleteProduct(id: string) {
  return update((db) => {
    const before = db.products.length;
    db.products = db.products.filter((product) => product.id !== id);
    return before !== db.products.length;
  });
}

export function updateSettings(settings: Settings) {
  return update((db) => {
    db.settings = settings;
    return db.settings;
  });
}

export function placeOrder(input: CheckoutInput): Promise<{ ok: true; order: Order } | { ok: false; error: string }> {
  return update((db) => {
    const items = [];
    for (const line of input.items) {
      const product = db.products.find((item) => item.id === line.productId && item.active);
      if (!product) return { ok: false as const, error: "Sepette artık satılmayan bir ürün var." };
      if (product.stock < line.quantity) {
        return { ok: false as const, error: `${product.name} için stok yetmiyor.` };
      }
      items.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: line.quantity,
        imageUrl: product.imageUrl,
      });
    }

    for (const line of items) {
      const product = db.products.find((item) => item.id === line.productId);
      if (product) product.stock -= line.quantity;
    }

    const shippingFee = money(db.settings.shippingFee || 0);
    const goods = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order: Order = {
      id: `MRG-${randomBytes(8).toString("hex").toUpperCase()}`,
      items,
      shippingFee,
      total: money(goods + shippingFee),
      buyerName: input.buyerName,
      buyerEmail: input.buyerEmail,
      buyerPhone: input.buyerPhone,
      address: input.address,
      city: input.city,
      note: input.note,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    db.orders.push(order);
    return { ok: true as const, order };
  });
}

export function attachShopierProduct(orderId: string, shopierProductId: string) {
  return update((db) => {
    const order = db.orders.find((item) => item.id === orderId);
    if (!order) return null;
    order.shopierProductId = shopierProductId;
    return order;
  });
}

function restoreStock(db: Database, order: Order) {
  for (const line of order.items) {
    const product = db.products.find((item) => item.id === line.productId);
    if (product) product.stock += line.quantity;
  }
}

export function cancelPending(orderId: string) {
  return update((db) => {
    const order = db.orders.find((item) => item.id === orderId);
    if (!order || order.status !== "pending") return null;
    restoreStock(db, order);
    order.status = "cancelled";
    return order;
  });
}

export function markPendingPaid(orderId: string, shopierOrderId?: string) {
  return update((db) => {
    const order = db.orders.find((item) => item.id === orderId);
    if (!order || order.status !== "pending") return null;
    order.status = "paid";
    order.paidAt = new Date().toISOString();
    if (shopierOrderId) order.shopierOrderId = shopierOrderId;
    return order;
  });
}

export function markPaidFromNotice(raw: string, eventId: string, shopierOrderId?: string) {
  return update((db) => {
    if (eventId && db.seenEvents.includes(eventId)) {
      return { ok: true as const, duplicate: true, shopierProductId: undefined };
    }
    const order = db.orders.find(
      (item) =>
        item.status !== "cancelled" &&
        (raw.includes(item.id) || (item.shopierProductId ? raw.includes(item.shopierProductId) : false)),
    );
    if (!order) return { ok: false as const, missing: true, shopierProductId: undefined };
    if (order.status === "paid") {
      if (eventId) db.seenEvents.push(eventId);
      return { ok: true as const, duplicate: true, shopierProductId: order.shopierProductId };
    }
    order.status = "paid";
    order.paidAt = new Date().toISOString();
    if (shopierOrderId) order.shopierOrderId = shopierOrderId;
    if (eventId) db.seenEvents.push(eventId);
    if (db.seenEvents.length > 500) db.seenEvents.splice(0, db.seenEvents.length - 500);
    return { ok: true as const, duplicate: false, shopierProductId: order.shopierProductId };
  });
}
