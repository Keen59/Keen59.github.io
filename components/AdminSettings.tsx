"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Settings } from "@/lib/types";

type Status = {
  pat: boolean;
  slug: boolean;
  webhook: boolean;
  osb: boolean;
  ready: boolean;
};

export function AdminSettings({
  settings,
  status,
  origin,
}: {
  settings: Settings;
  status: Status;
  origin: string;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(settings);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setSaved(false);
    setError("");
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    setPending(false);
    if (!response.ok) {
      setError(data.error || "Ayarlar kaydedilemedi.");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  const rows = [
    ["Kişisel erişim anahtarı", status.pat],
    ["Mağaza kısa adı", status.slug],
    ["Webhook anahtarı", status.webhook],
    ["OSB kullanıcı ve şifre", status.osb],
  ] as const;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={save} className="rounded-3xl border border-line bg-paper p-5">
        <h2 className="font-serif text-3xl">Dükkan</h2>
        <div className="mt-4 grid gap-3">
          <label className="field">
            <span>Ad</span>
            <input value={draft.shopName} onChange={(event) => setDraft({ ...draft, shopName: event.target.value })} />
          </label>
          <label className="field">
            <span>Kısa cümle</span>
            <input value={draft.tagline} onChange={(event) => setDraft({ ...draft, tagline: event.target.value })} />
          </label>
          <label className="field">
            <span>Telefon</span>
            <input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} />
          </label>
          <label className="field">
            <span>E-posta</span>
            <input value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} />
          </label>
          <label className="field">
            <span>Adres</span>
            <textarea value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} />
          </label>
          <label className="field">
            <span>Hakkında</span>
            <textarea value={draft.about} onChange={(event) => setDraft({ ...draft, about: event.target.value })} />
          </label>
          <label className="field">
            <span>Kargo ücreti (TL)</span>
            <input
              inputMode="decimal"
              value={String(draft.shippingFee)}
              onChange={(event) => setDraft({ ...draft, shippingFee: Number(event.target.value.replace(",", ".")) || 0 })}
            />
          </label>
        </div>
        {error ? <p className="mt-3 text-sm text-[#8c2d20]">{error}</p> : null}
        {saved ? <p className="mt-3 text-sm text-moss">Kaydedildi.</p> : null}
        <button className="btn btn-primary mt-4" type="submit" disabled={pending}>
          {pending ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
      <section className="rounded-3xl border border-line bg-cream p-5">
        <h2 className="font-serif text-3xl">Shopier</h2>
        <p className="mt-3 text-sm leading-6 text-ink/75">
          Anahtarlar site dosyasına, `.env.local` içine yazılır. Ayrı bir sunucu açılmaz; ödeme kapısı bu sitenin
          içindedir ve anahtar tarayıcıya çıkmaz.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {rows.map(([label, ok]) => (
            <li key={label} className="flex items-center justify-between gap-3 rounded-2xl bg-paper px-3 py-2">
              <span>{label}</span>
              <span className={ok ? "text-moss" : "text-[#8c2d20]"}>{ok ? "Hazır" : "Eksik"}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm font-medium">{status.ready ? "Ödeme alınabilir." : "Ödeme kapalı. Anahtar ve mağaza adı gerekli."}</p>
        <div className="mt-4 space-y-3 text-sm">
          <p>
            Webhook adresi
            <code className="mt-1 block overflow-x-auto rounded-xl bg-paper px-3 py-2">{origin}/api/shopier/webhook</code>
          </p>
          <p>
            OSB bildirim adresi
            <code className="mt-1 block overflow-x-auto rounded-xl bg-paper px-3 py-2">{origin}/api/shopier/osb</code>
          </p>
        </div>
        <p className="mt-4 text-sm leading-6 text-ink/70">
          Shopier bu adreslere ancak site internetten erişilebilir ve https ise ulaşır. Yerel bilgisayardaki localhost
          adresi canlı ödeme bildirimi almaz.
        </p>
      </section>
    </div>
  );
}
