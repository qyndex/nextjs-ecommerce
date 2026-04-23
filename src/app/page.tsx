import { ProductCard } from "@/components/ProductCard";

const products = [
  { id: "1", name: "Classic T-Shirt", price: 29.99, image: "/images/tshirt.jpg", category: "Apparel" },
  { id: "2", name: "Wireless Headphones", price: 89.99, image: "/images/headphones.jpg", category: "Electronics" },
  { id: "3", name: "Leather Wallet", price: 49.99, image: "/images/wallet.jpg", category: "Accessories" },
  { id: "4", name: "Running Shoes", price: 119.99, image: "/images/shoes.jpg", category: "Footwear" },
];

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Featured Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
