import { redirect } from "next/navigation";
import { AdminNav } from "@/components/AdminNav";
import { isAdmin } from "@/lib/auth";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/giris");

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <AdminNav />
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
