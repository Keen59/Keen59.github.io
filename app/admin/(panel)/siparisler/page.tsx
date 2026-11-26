import { AdminOrders } from "@/components/AdminOrders";
import { listOrders } from "@/lib/store";

export const metadata = { title: "Siparişler" };

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-serif text-5xl">Siparişler</h1>
      <div className="mt-8">
        <AdminOrders orders={listOrders()} />
      </div>
    </div>
  );
}
