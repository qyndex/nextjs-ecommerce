import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/lib/store";

// Reset store state between tests by replacing items directly.
function resetStore() {
  useCartStore.setState({ items: [] });
}

describe("useCartStore", () => {
  beforeEach(resetStore);

  it("starts with an empty cart", () => {
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("addItem appends a new product", () => {
    useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 29.99, quantity: 1 });
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe("T-Shirt");
  });

  it("addItem increments quantity when same id added again", () => {
    const item = { id: "1", name: "T-Shirt", price: 29.99, quantity: 1 };
    useCartStore.getState().addItem(item);
    useCartStore.getState().addItem(item);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it("removeItem deletes a product by id", () => {
    useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 29.99, quantity: 1 });
    useCartStore.getState().addItem({ id: "2", name: "Shoes", price: 119.99, quantity: 1 });
    useCartStore.getState().removeItem("1");
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("2");
  });

  it("updateQuantity changes the quantity of an item", () => {
    useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 29.99, quantity: 1 });
    useCartStore.getState().updateQuantity("1", 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  it("updateQuantity with 0 removes the item", () => {
    useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 29.99, quantity: 1 });
    useCartStore.getState().updateQuantity("1", 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("total computes the sum of price * quantity across all items", () => {
    useCartStore.getState().addItem({ id: "1", name: "T-Shirt", price: 10, quantity: 2 });
    useCartStore.getState().addItem({ id: "2", name: "Shoes", price: 50, quantity: 1 });
    expect(useCartStore.getState().total()).toBe(70);
  });

  it("total returns 0 for an empty cart", () => {
    expect(useCartStore.getState().total()).toBe(0);
  });
});
