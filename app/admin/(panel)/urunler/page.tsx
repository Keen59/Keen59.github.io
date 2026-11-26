import { AdminProducts } from "@/components/AdminProducts";
import { listProducts } from "@/lib/store";

export const metadata = { title: "Ürünler" };

export default function AdminProductsPage() {
  return (
    <div>
      <h1 className="font-serif text-5xl">Ürünler</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70">
        Eklediğiniz ürün vitrine düşer. Kaldırdığınız ürün yeni sipariş almaz; eski siparişlerdeki adı durur.
      </p>
      <div className="mt-8">
        <AdminProducts products={listProducts()} />
      </div>
    </div>
  );
}
