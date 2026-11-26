import { CartView } from "@/components/CartView";
import { getSettings, listProducts } from "@/lib/store";

export const metadata = { title: "Sepet" };

export default function CartPage() {
  const products = listProducts();
  const settings = getSettings();
  return (
    <div>
      <h1 className="font-serif text-5xl">Sepet</h1>
      <div className="mt-8">
        <CartView products={products} shippingFee={settings.shippingFee || 0} />
      </div>
    </div>
  );
}
