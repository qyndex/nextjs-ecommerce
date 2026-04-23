"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";

interface AddToCartButtonProps {
  productId: string;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const { addItem } = useCartStore();

  function handleClick() {
    addItem({
      id: productId,
      name: `Product #${productId}`,
      price: 49.99,
      quantity: 1,
    });
  }

  return (
    <Button size="lg" className="mt-6" onClick={handleClick}>
      Add to Cart
    </Button>
  );
}
