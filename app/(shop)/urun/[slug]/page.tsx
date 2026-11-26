import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { formatTry } from "@/lib/format";
import { getProductBySlug } from "@/lib/store";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product?.name || "Ürün" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || !product.active) notFound();

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="overflow-hidden rounded-[2rem] bg-bark">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="aspect-[4/5] w-full object-cover" />
        ) : (
          <div className="flex aspect-[4/5] items-center justify-center px-8 text-center font-serif text-4xl text-cream/85">
            {product.name}
          </div>
        )}
      </div>
      <div>
        <Link href="/urunler" className="text-sm text-ink/55 underline decoration-brass underline-offset-4">
          Vitrine dön
        </Link>
        <h1 className="mt-3 font-serif text-5xl leading-tight">{product.name}</h1>
        <p className="mt-4 font-serif text-3xl text-wood">{formatTry(product.price)}</p>
        <p className="mt-2 text-sm uppercase tracking-[0.16em] text-ink/45">
          {product.stock > 0 ? `Stokta ${product.stock} adet` : "Tükendi"}
        </p>
        <p className="mt-6 whitespace-pre-line text-lg leading-8 text-ink/80">{product.description}</p>
        <div className="mt-8">
          <AddToCart productId={product.id} stock={product.stock} />
        </div>
        <p className="mt-6 max-w-md text-sm leading-6 text-ink/60">
          Ödeme Shopier sayfasında alınır. Teslimat adresini bir sonraki adımda yazarsınız.
        </p>
      </div>
    </div>
  );
}
