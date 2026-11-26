"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export function AddToCart({
  productId,
  stock,
  compact = false,
}: {
  productId: string;
  stock: number;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  if (stock < 1) {
    return <span className="text-sm text-ink/50">Stokta yok</span>;
  }

  function add() {
    const safeQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;
    addItem(productId, compact ? 1 : safeQuantity, stock);
    setNote("Sepete eklendi");
    window.setTimeout(() => setNote(""), 1600);
  }

  if (compact) {
    return (
      <button type="button" className="btn btn-primary px-3 py-2 text-sm" onClick={add}>
        {note || "Sepete ekle"}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="field w-24">
        <span>Adet</span>
        <input
          type="number"
          min={1}
          max={Math.min(stock, 20)}
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
        />
      </label>
      <button type="button" className="btn btn-primary mt-6" onClick={add}>
        Sepete ekle
      </button>
      {note ? <p className="mt-6 text-sm text-moss">{note}</p> : null}
    </div>
  );
}
