import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CartProvider } from "@/components/CartProvider";
import { getSettings } from "@/lib/store";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header shopName={settings.shopName} phone={settings.phone} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">{children}</main>
        <Footer settings={settings} />
      </div>
    </CartProvider>
  );
}
