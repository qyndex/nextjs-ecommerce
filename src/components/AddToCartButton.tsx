"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  price: number;
  image?: string;
  slug?: string;
}

export function AddToCartButton({
  productId,
  productName,
  price,
  image,
  slug,
}: AddToCartButtonProps) {
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({
      id: productId,
      name: productName,
      price,
      quantity: 1,
      image,
      slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Button
      size="lg"
      className="mt-6 gap-2"
      onClick={handleClick}
      aria-label={`Add ${productName} to cart`}
    >
      <ShoppingCart className="h-4 w-4" />
      {added ? "Added!" : "Add to Cart"}
    </Button>
  );
}
