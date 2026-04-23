"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store";

export function Navbar() {
  const { items } = useCartStore();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold">
          Store
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Products
          </Link>
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
