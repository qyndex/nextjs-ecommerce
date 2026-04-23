import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="rounded-xl border overflow-hidden transition-shadow hover:shadow-lg">
        <div className="aspect-square relative bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="p-4">
          <p className="text-xs text-muted-foreground">{product.category}</p>
          <h3 className="font-semibold mt-1">{product.name}</h3>
          <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
          <Button variant="outline" size="sm" className="w-full mt-3">
            View Details
          </Button>
        </div>
      </div>
    </Link>
  );
}
