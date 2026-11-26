"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setError(data.error || "Giriş yapılamadı.");
      setPending(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-line bg-paper p-6 shadow-card">
      <p className="text-xs uppercase tracking-[0.18em] text-wood">Yönetim</p>
      <h1 className="mt-2 font-serif text-4xl">Atölye kapısı</h1>
      <label className="field mt-6">
        <span>Şifre</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>
      {error ? <p className="mt-3 text-sm text-[#8c2d20]">{error}</p> : null}
      <button className="btn btn-primary mt-5 w-full" type="submit" disabled={pending}>
        {pending ? "Kontrol ediliyor..." : "Giriş yap"}
      </button>
    </form>
  );
}
