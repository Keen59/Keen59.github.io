import { ProductCard } from "@/components/ProductCard";
import { listActiveProducts } from "@/lib/store";

export const metadata = { title: "Ürünler" };

export default function ProductsPage() {
  const products = listActiveProducts();
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.22em] text-wood">Vitrin</p>
      <h1 className="mt-2 font-serif text-5xl">Hazır parçalar</h1>
      {products.length === 0 ? (
        <p className="mt-8 text-ink/70">Şu an vitrinde ürün yok.</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
