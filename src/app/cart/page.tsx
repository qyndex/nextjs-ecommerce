"use client";

import { useCartStore } from "@/lib/store";
import { CartItem } from "@/components/CartItem";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, total } = useCartStore();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Add some products to get started.
        </p>
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
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {items.reduce((sum, i) => sum + i.quantity, 0)} item(s)
            </p>
            <p className="text-2xl font-bold">Total: ${total().toFixed(2)}</p>
          </div>
          {user ? (
            <Link href="/checkout">
              <Button size="lg">Proceed to Checkout</Button>
            </Link>
          ) : (
            <Link href="/auth/login?redirect=/checkout">
              <Button size="lg">Sign In to Checkout</Button>
            </Link>
          )}
        </div>
        {!user && (
          <p className="text-sm text-muted-foreground text-right">
            You need to sign in before checking out. Your cart will be saved.
          </p>
        )}
      </div>
    </div>
  );
}
