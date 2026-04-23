import Image from "next/image";
import { AddToCartButton } from "@/components/AddToCartButton";

interface Props {
  params: { id: string };
}

export default function ProductPage({ params }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="aspect-square relative rounded-xl overflow-hidden bg-muted">
        <Image src="/images/placeholder.jpg" alt="Product" fill className="object-cover" />
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-bold">Product #{params.id}</h1>
        <p className="text-2xl font-semibold mt-4">$49.99</p>
        <p className="mt-4 text-muted-foreground">
          High-quality product with premium materials and expert craftsmanship.
          Perfect for everyday use.
        </p>
        <AddToCartButton productId={params.id} />
      </div>
    </div>
  );
}
