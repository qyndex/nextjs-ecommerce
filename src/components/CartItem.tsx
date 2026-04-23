"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, type CartItem as CartItemData } from "@/lib/store";

export function CartItem({ item }: { item: CartItemData }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <Link
        href={`/products/${item.slug ?? item.id}`}
        className="shrink-0"
        aria-label={`View ${item.name}`}
      >
        {item.image ? (
          <div className="h-20 w-20 relative rounded-md overflow-hidden bg-muted">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-20 w-20 rounded-md bg-muted" />
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{item.name}</h3>
        <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          aria-label={`Decrease quantity of ${item.name}`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          aria-label={`Increase quantity of ${item.name}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeItem(item.id)}
        aria-label={`Remove ${item.name} from cart`}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
