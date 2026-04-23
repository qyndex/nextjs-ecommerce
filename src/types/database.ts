/** Database row types matching the Supabase schema */

export interface Profile {
  id: string;
  full_name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  category_id: string | null;
  stock: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductWithCategory extends Product {
  categories: Category | null;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  stripe_payment_intent_id: string | null;
  shipping_address: ShippingAddress | null;
  created_at: string;
}

export interface OrderWithItems extends Order {
  order_items: OrderItemWithProduct[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface OrderItemWithProduct extends OrderItem {
  products: Product;
}

export interface CartItemRow {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

export interface CartItemWithProduct extends CartItemRow {
  products: Product;
}

export interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip: string;
}
