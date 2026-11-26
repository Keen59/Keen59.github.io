import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getSettings, listActiveProducts } from "@/lib/store";

export default function HomePage() {
  const settings = getSettings();
  const products = listActiveProducts();
  const featured = products.slice(0, 3);

  return (
    <div className="grid gap-14">
      <section className="relative overflow-hidden rounded-[2rem] bg-bark text-cream">
        <img
          src="https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bark via-bark/88 to-bark/25" />
        <div className="relative grid gap-6 px-6 py-16 md:px-12 md:py-24 lg:max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-brass">Atölye</p>
          <h1 className="font-serif text-5xl leading-[1.02] md:text-7xl">Ahşabı işler, evi ısıtır.</h1>
          <p className="max-w-xl text-lg leading-8 text-cream/80">{settings.about}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/urunler" className="btn bg-cream text-bark hover:bg-white">
              Parçalara bak
            </Link>
            <Link href="/sepet" className="btn border border-cream/30 text-cream">
              Sepeti aç
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 border-y border-line py-6 md:grid-cols-3">
        {[
          ["01", "Parçayı seçin", "Vitrindeki hazır işlerden sepete ekleyin."],
          ["02", "Adresi yazın", "Teslimat bilgisi siparişe burada kaydolur."],
          ["03", "Shopier ile ödeyin", "Kart tahsilatını Shopier alır, sipariş burada durur."],
        ].map(([index, title, text]) => (
          <div key={index}>
            <p className="text-xs tracking-[0.18em] text-brass">{index}</p>
            <h2 className="mt-2 font-serif text-2xl">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-ink/70">{text}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-serif text-4xl">Vitrin</h2>
          <Link href="/urunler" className="text-sm underline decoration-brass underline-offset-4">
            Tümü
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-line px-6 py-12 text-ink/70">Şu an vitrinde ürün yok.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
