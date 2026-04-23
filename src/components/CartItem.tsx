import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store";

interface CartItemData {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export function CartItem({ item }: { item: CartItemData }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <div className="h-20 w-20 rounded-md bg-muted" />
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
