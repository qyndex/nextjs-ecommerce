"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import type { ProductWithCategory } from "@/types/database";
import { Loader2, ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";

interface Props {
  params: { slug: string };
}

export default function ProductPage({ params }: Props) {
  const [product, setProduct] = useState<ProductWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    async function load() {
      setLoading(true);

      // Try slug first, then fall back to id
      let query = supabase
        .from("products")
        .select("*, categories(*)")
        .eq("slug", params.slug)
        .single();

      let { data, error } = await query;

      if (error || !data) {
        // Try by ID
        const byId = await supabase
          .from("products")
          .select("*, categories(*)")
          .eq("id", params.slug)
          .single();
        data = byId.data;
      }

      setProduct(data as ProductWithCategory | null);
      setLoading(false);
    }

    load();
  }, [params.slug]);

  function handleAddToCart() {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity,
      image: product.image_url ?? undefined,
      slug: product.slug ?? undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link href="/">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const imageUrl = product.image_url ?? "/images/placeholder.jpg";
  const hasDiscount =
    product.compare_at_price != null &&
    product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.compare_at_price) - Number(product.price)) /
          Number(product.compare_at_price)) *
          100
      )
    : 0;

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        aria-label="Back to products"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square relative rounded-xl overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-md">
              -{discountPercent}%
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center">
          {product.categories && (
            <p className="text-sm text-muted-foreground mb-1">
              {product.categories.name}
            </p>
          )}
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-3 mt-4">
            <p className="text-2xl font-semibold">
              ${Number(product.price).toFixed(2)}
            </p>
            {hasDiscount && (
              <p className="text-lg text-muted-foreground line-through">
                ${Number(product.compare_at_price).toFixed(2)}
              </p>
            )}
          </div>

          {product.description && (
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center text-sm font-medium">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {added
                ? "Added!"
                : product.stock <= 0
                  ? "Out of Stock"
                  : "Add to Cart"}
            </Button>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Currently unavailable"}
          </p>
        </div>
      </div>
    </div>
  );
}
