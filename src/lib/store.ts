import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import type { CartItemWithProduct } from "@/types/database";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  slug?: string;
}

interface CartState {
  items: CartItem[];
  userId: string | null;
  loading: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  setUserId: (userId: string | null) => void;
  syncFromDb: () => Promise<void>;
  syncToDb: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      userId: null,
      loading: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
        const { userId } = get();
        if (userId) {
          // Fire-and-forget DB sync for authenticated users
          supabase
            .from("cart_items")
            .upsert(
              {
                user_id: userId,
                product_id: item.id,
                quantity:
                  (get().items.find((i) => i.id === item.id)?.quantity ??
                    item.quantity),
              },
              { onConflict: "user_id,product_id" }
            )
            .then();
        }
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
        const { userId } = get();
        if (userId) {
          supabase
            .from("cart_items")
            .delete()
            .eq("user_id", userId)
            .eq("product_id", id)
            .then();
        }
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
        const { userId } = get();
        if (userId) {
          supabase
            .from("cart_items")
            .update({ quantity })
            .eq("user_id", userId)
            .eq("product_id", id)
            .then();
        }
      },

      clearCart: () => {
        const { userId } = get();
        set({ items: [] });
        if (userId) {
          supabase.from("cart_items").delete().eq("user_id", userId).then();
        }
      },

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      setUserId: (userId) => set({ userId }),

      syncFromDb: async () => {
        const { userId } = get();
        if (!userId) return;
        set({ loading: true });
        const { data } = await supabase
          .from("cart_items")
          .select("*, products(*)")
          .eq("user_id", userId);
        if (data && data.length > 0) {
          const dbItems: CartItem[] = (data as CartItemWithProduct[]).map(
            (row) => ({
              id: row.product_id,
              name: row.products.name,
              price: Number(row.products.price),
              quantity: row.quantity,
              image: row.products.image_url ?? undefined,
              slug: row.products.slug ?? undefined,
            })
          );
          set({ items: dbItems, loading: false });
        } else {
          set({ loading: false });
        }
      },

      syncToDb: async () => {
        const { userId, items } = get();
        if (!userId || items.length === 0) return;
        // Merge guest cart into DB
        const upserts = items.map((item) => ({
          user_id: userId,
          product_id: item.id,
          quantity: item.quantity,
        }));
        await supabase
          .from("cart_items")
          .upsert(upserts, { onConflict: "user_id,product_id" });
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);
