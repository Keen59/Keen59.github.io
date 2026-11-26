"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatTry } from "@/lib/format";
import type { Product } from "@/lib/types";

type Draft = {
  id?: string;
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  active: boolean;
};

const emptyDraft: Draft = {
  name: "",
  description: "",
  price: "",
  stock: "1",
  imageUrl: "",
  active: true,
};

export function AdminProducts({ products }: { products: Product[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function edit(product: Product) {
    setDraft({
      id: product.id,
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl,
      active: product.active,
    });
    setError("");
  }

  async function upload(file: File) {
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body });
    const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
    if (!response.ok || !data.url) {
      setError(data.error || "Görsel yüklenemedi.");
      return;
    }
    setDraft((current) => ({ ...current, imageUrl: data.url || "" }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const payload = {
      name: draft.name,
      description: draft.description,
      price: draft.price,
      stock: Number(draft.stock),
      imageUrl: draft.imageUrl,
      active: draft.active,
    };
    const response = await fetch(draft.id ? `/api/admin/products/${draft.id}` : "/api/admin/products", {
      method: draft.id ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    setPending(false);
    if (!response.ok) {
      setError(data.error || "Ürün kaydedilemedi.");
      return;
    }
    setDraft(emptyDraft);
    router.refresh();
  }

  async function remove(id: string) {
    if (!window.confirm("Bu ürün vitrinden kaldırılsın mı?")) return;
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setError(data.error || "Ürün kaldırılamadı.");
      return;
    }
    if (draft.id === id) setDraft(emptyDraft);
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={save} className="h-fit rounded-3xl border border-line bg-paper p-5">
        <h2 className="font-serif text-3xl">{draft.id ? "Ürünü düzenle" : "Ürün ekle"}</h2>
        <div className="mt-4 grid gap-3">
          <label className="field">
            <span>Ad</span>
            <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required />
          </label>
          <label className="field">
            <span>Açıklama</span>
            <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="field">
              <span>Fiyat (TL)</span>
              <input inputMode="decimal" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} required />
            </label>
            <label className="field">
              <span>Stok</span>
              <input type="number" min={0} value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: event.target.value })} required />
            </label>
          </div>
          <label className="field">
            <span>Görsel adresi</span>
            <input value={draft.imageUrl} onChange={(event) => setDraft({ ...draft, imageUrl: event.target.value })} placeholder="https:// veya yükleyin" />
          </label>
          <label className="text-sm text-ink/70">
            Bilgisayardan yükle
            <input
              className="mt-1 block w-full text-sm"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
              }}
            />
          </label>
          {draft.imageUrl ? <img src={draft.imageUrl} alt="" className="h-36 w-full rounded-2xl object-cover" /> : null}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />
            Vitrinde görünsün
          </label>
        </div>
        {error ? <p className="mt-3 text-sm text-[#8c2d20]">{error}</p> : null}
        <div className="mt-4 flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Kaydediliyor..." : draft.id ? "Değişiklikleri kaydet" : "Ürünü ekle"}
          </button>
          {draft.id ? (
            <button className="btn btn-ghost" type="button" onClick={() => setDraft(emptyDraft)}>
              Vazgeç
            </button>
          ) : null}
        </div>
      </form>
      <div className="overflow-x-auto rounded-3xl border border-line bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-[0.14em] text-ink/50">
            <tr>
              <th className="px-4 py-3 font-medium">Ürün</th>
              <th className="px-4 py-3 font-medium">Fiyat</th>
              <th className="px-4 py-3 font-medium">Stok</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-ink/60" colSpan={4}>
                  Henüz ürün yok.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-ink/50">{product.active ? "Vitrinde" : "Gizli"}</p>
                  </td>
                  <td className="px-4 py-3">{formatTry(product.price)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className="btn btn-ghost px-3 py-2 text-xs" type="button" onClick={() => edit(product)}>
                        Düzenle
                      </button>
                      <button className="btn btn-danger px-3 py-2 text-xs" type="button" onClick={() => remove(product.id)}>
                        Kaldır
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
