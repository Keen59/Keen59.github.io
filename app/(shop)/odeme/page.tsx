import { CheckoutForm } from "@/components/CheckoutForm";
import { getSettings, listActiveProducts } from "@/lib/store";

export const metadata = { title: "Ödeme" };

export default function CheckoutPage() {
  const settings = getSettings();
  const products = listActiveProducts();
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-wood">Shopier</p>
      <h1 className="mt-2 font-serif text-5xl">Teslimat</h1>
      <p className="mt-3 max-w-2xl text-ink/70">Adres siparişe işlenir. Kart bilgisi bu sitede durmaz, Shopier tahsil eder.</p>
      <div className="mt-8">
        <CheckoutForm products={products} shippingFee={settings.shippingFee || 0} />
      </div>
    </div>
  );
}
