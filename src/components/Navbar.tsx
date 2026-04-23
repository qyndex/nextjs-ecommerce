"use client";

import Link from "next/link";
import { ShoppingCart, User, LogOut, Package } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { items } = useCartStore();
  const { user, loading, signOut } = useAuth();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold">
          Store
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors"
            aria-label="Browse products"
          >
            Products
          </Link>

          {!loading && user && (
            <Link
              href="/orders"
              className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
              aria-label="View order history"
            >
              <Package className="h-4 w-4" />
              Orders
            </Link>
          )}

          <Link href="/cart" className="relative" aria-label="Shopping cart">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {user.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={signOut}
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <User className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
