"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { ShippingAddress } from "@/types/database";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [address, setAddress] = useState<ShippingAddress>({
    full_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    zip: "",
  });

  function updateAddress(field: keyof ShippingAddress, value: string) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setProcessing(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("Your session has expired. Please sign in again.");
        setProcessing(false);
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shipping_address: address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Checkout failed. Please try again.");
        setProcessing(false);
        return;
      }

      // Order created successfully
      clearCart();
      setOrderId(data.order.id);
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setProcessing(false);
  }

  // Success state
  if (orderId) {
    return (
      <div className="mx-auto max-w-md text-center space-y-6 py-12">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold tracking-tight">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <p className="text-sm font-mono bg-muted rounded-md px-3 py-2 inline-block">
          Order #{orderId.slice(0, 8)}
        </p>
        <div className="flex gap-3 justify-center">
          <Link href={`/orders/${orderId}`}>
            <Button>View Order</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        aria-label="Back to cart"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Shipping form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-3 space-y-6"
          id="checkout-form"
        >
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold">Shipping Address</h2>

            <div>
              <label
                htmlFor="full-name"
                className="block text-sm font-medium mb-1.5"
              >
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                required
                value={address.full_name}
                onChange={(e) => updateAddress("full_name", e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Jane Doe"
                aria-label="Full name"
              />
            </div>

            <div>
              <label
                htmlFor="address-1"
                className="block text-sm font-medium mb-1.5"
              >
                Address Line 1
              </label>
              <input
                id="address-1"
                type="text"
                required
                value={address.address_line1}
                onChange={(e) =>
                  updateAddress("address_line1", e.target.value)
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="123 Main St"
                aria-label="Street address"
              />
            </div>

            <div>
              <label
                htmlFor="address-2"
                className="block text-sm font-medium mb-1.5"
              >
                Address Line 2{" "}
                <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                id="address-2"
                type="text"
                value={address.address_line2 ?? ""}
                onChange={(e) =>
                  updateAddress("address_line2", e.target.value)
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Apt 4B"
                aria-label="Apartment or suite number"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium mb-1.5"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => updateAddress("city", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="New York"
                  aria-label="City"
                />
              </div>
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium mb-1.5"
                >
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => updateAddress("state", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="NY"
                  aria-label="State"
                />
              </div>
              <div>
                <label
                  htmlFor="zip"
                  className="block text-sm font-medium mb-1.5"
                >
                  ZIP
                </label>
                <input
                  id="zip"
                  type="text"
                  required
                  value={address.zip}
                  onChange={(e) => updateAddress("zip", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="10001"
                  aria-label="ZIP code"
                />
              </div>
            </div>
          </div>

          {error && (
            <div
              className="rounded-md bg-destructive/10 text-destructive text-sm p-3"
              role="alert"
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Order...
              </>
            ) : (
              `Place Order - $${total().toFixed(2)}`
            )}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Secure checkout
          </p>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.image ? (
                    <div className="h-12 w-12 relative rounded-md overflow-hidden bg-muted shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-md bg-muted shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between font-semibold text-lg mt-3 pt-3 border-t">
                <span>Total</span>
                <span>${total().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
