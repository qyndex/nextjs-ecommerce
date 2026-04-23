import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  slug?: string | null;
  price: number;
  compare_at_price?: number | null;
  image_url?: string | null;
  image?: string;
  category?: string;
  categories?: { name: string; slug: string | null } | null;
}

export function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.slug ?? product.id}`;
  const imageUrl =
    product.image_url ?? product.image ?? "/images/placeholder.jpg";
  const category =
    product.categories?.name ?? product.category ?? "";

  return (
    <Link href={href} className="group">
      <div className="rounded-xl border overflow-hidden transition-shadow hover:shadow-lg">
        <div className="aspect-square relative bg-muted">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="p-4">
          {category && (
            <p className="text-xs text-muted-foreground">{category}</p>
          )}
          <h3 className="font-semibold mt-1">{product.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-lg font-bold">${Number(product.price).toFixed(2)}</p>
            {product.compare_at_price != null &&
              product.compare_at_price > product.price && (
                <p className="text-sm text-muted-foreground line-through">
                  ${Number(product.compare_at_price).toFixed(2)}
                </p>
              )}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-3">
            View Details
          </Button>
        </div>
      </div>
    </Link>
  );
}
