import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatTry } from "@/lib/format";
import { AddToCart } from "./AddToCart";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-card">
      <Link href={`/urun/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-bark">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <span className="flex h-full items-center justify-center px-6 text-center font-serif text-3xl text-cream/85">
            {product.name}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/urun/${product.slug}`} className="font-serif text-2xl leading-tight">
            {product.name}
          </Link>
          <p className="shrink-0 pt-1 text-sm text-wood">{formatTry(product.price)}</p>
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-ink/70">{product.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-xs uppercase tracking-[0.16em] text-ink/45">
            {product.stock > 0 ? `${product.stock} adet` : "Tükendi"}
          </span>
          <AddToCart productId={product.id} stock={product.stock} compact />
        </div>
      </div>
    </article>
  );
}
