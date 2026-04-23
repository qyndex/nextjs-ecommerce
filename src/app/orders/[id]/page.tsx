"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import type { OrderWithItems, ShippingAddress } from "@/types/database";
import { Loader2, ArrowLeft, Package } from "lucide-react";

interface Props {
  params: { id: string };
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusSteps = ["pending", "processing", "shipped", "delivered"];

export default function OrderDetailPage({ params }: Props) {
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    async function loadOrder() {
      setLoading(true);
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("id", params.id)
        .single();

      setOrder(data as OrderWithItems | null);
      setLoading(false);
    }

    loadOrder();
  }, [user, authLoading, params.id]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Link href="/orders">
          <Button>View All Orders</Button>
        </Link>
      </div>
    );
  }

  const shippingAddress = order.shipping_address as ShippingAddress | null;
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        aria-label="Back to orders"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-muted-foreground mt-1">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={`text-sm font-medium px-3 py-1.5 rounded-full capitalize ${statusColors[order.status] ?? "bg-gray-100 text-gray-800"}`}
        >
          {order.status}
        </span>
      </div>

      {/* Status progress bar */}
      {order.status !== "cancelled" && (
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {statusSteps.map((step, index) => (
              <div
                key={step}
                className={`text-xs font-medium capitalize ${
                  index <= currentStepIndex
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${((currentStepIndex + 1) / statusSteps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Order items */}
      <div className="rounded-lg border bg-card p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Items
        </h2>
        <div className="space-y-4">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              {item.products?.image_url ? (
                <div className="h-16 w-16 relative rounded-md overflow-hidden bg-muted shrink-0">
                  <Image
                    src={item.products.image_url}
                    alt={item.products.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-md bg-muted shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {item.products?.name ?? "Unknown Product"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Qty: {item.quantity} x ${Number(item.unit_price).toFixed(2)}
                </p>
              </div>
              <p className="font-medium">
                ${(item.quantity * Number(item.unit_price)).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>${Number(order.total).toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping address */}
      {shippingAddress && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-3">Shipping Address</h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">
              {shippingAddress.full_name}
            </p>
            <p>{shippingAddress.address_line1}</p>
            {shippingAddress.address_line2 && (
              <p>{shippingAddress.address_line2}</p>
            )}
            <p>
              {shippingAddress.city}, {shippingAddress.state}{" "}
              {shippingAddress.zip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
