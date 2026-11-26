import { headers } from "next/headers";
import { AdminSettings } from "@/components/AdminSettings";
import { shopierStatus } from "@/lib/shopier";
import { getSettings } from "@/lib/store";

export const metadata = { title: "Ayarlar" };

export default async function AdminSettingsPage() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host") || "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");

  return (
    <div>
      <h1 className="font-serif text-5xl">Ayarlar</h1>
      <div className="mt-8">
        <AdminSettings settings={getSettings()} status={shopierStatus()} origin={`${proto}://${host}`} />
      </div>
    </div>
  );
}
