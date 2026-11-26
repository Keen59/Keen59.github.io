export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  active: boolean;
  createdAt: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

export type OrderStatus = "pending" | "paid" | "cancelled";

export type Order = {
  id: string;
  items: OrderItem[];
  shippingFee: number;
  total: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  address: string;
  city: string;
  note: string;
  status: OrderStatus;
  shopierProductId?: string;
  shopierOrderId?: string;
  createdAt: string;
  paidAt?: string;
};

export type Settings = {
  shopName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  about: string;
  shippingFee: number;
};

export type Database = {
  products: Product[];
  orders: Order[];
  settings: Settings;
  seenEvents: string[];
};

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  active: boolean;
};

export type CheckoutInput = {
  items: { productId: string; quantity: number }[];
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  address: string;
  city: string;
  note: string;
};
