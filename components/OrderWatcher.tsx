"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function OrderWatcher({ status }: { status: string }) {
  const router = useRouter();
  useEffect(() => {
    if (status !== "pending") return;
    const timer = window.setInterval(() => router.refresh(), 4000);
    return () => window.clearInterval(timer);
  }, [status, router]);
  return null;
}
