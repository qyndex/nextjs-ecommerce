"use client";

import { useCartStore } from "@/lib/store";
import { CartItem } from "@/components/CartItem";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CartPage() {
  const { items, total } = useCartStore();

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
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className="mt-8 border-t pt-6 flex justify-between items-center">
        <p className="text-2xl font-bold">Total: ${total().toFixed(2)}</p>
        <Link href="/checkout">
          <Button size="lg">Proceed to Checkout</Button>
        </Link>
      </div>
    </div>
  );
}
