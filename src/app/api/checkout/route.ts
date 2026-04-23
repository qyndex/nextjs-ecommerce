import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { ShippingAddress } from "@/types/database";

interface CheckoutItem {
  id: string;
  quantity: number;
  price: number;
}

interface CheckoutBody {
  items: CheckoutItem[];
  shipping_address: ShippingAddress;
}

export async function POST(request: Request) {
  try {
    // Get the auth token from the request
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    const token = authHeader.replace("Bearer ", "");

    // Create a Supabase client with the user's token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }
    );

    // Verify the user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    const body: CheckoutBody = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!body.shipping_address?.full_name || !body.shipping_address?.address_line1) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    // Verify products exist and get current prices from DB
    const productIds = body.items.map((i) => i.id);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, price, stock, name")
      .in("id", productIds);

    if (productsError || !products) {
      return NextResponse.json(
        { error: "Failed to verify products" },
        { status: 500 }
      );
    }

    // Build price map from DB (prevents price tampering)
    const priceMap = new Map(
      products.map((p) => [p.id, { price: Number(p.price), stock: p.stock }])
    );

    // Validate stock and calculate total from DB prices
    let total = 0;
    const orderItems: { product_id: string; quantity: number; unit_price: number }[] = [];

    for (const item of body.items) {
      const dbProduct = priceMap.get(item.id);
      if (!dbProduct) {
        return NextResponse.json(
          { error: `Product ${item.id} not found` },
          { status: 400 }
        );
      }
      if (dbProduct.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product ${item.id}` },
          { status: 400 }
        );
      }
      total += dbProduct.price * item.quantity;
      orderItems.push({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: dbProduct.price,
      });
    }

    // Generate a mock payment intent ID (in production, this would come from Stripe)
    const mockPaymentIntentId = `pi_mock_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: "processing",
        total,
        stripe_payment_intent_id: mockPaymentIntentId,
        shipping_address: body.shipping_address,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order creation failed:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Create order items
    const itemsWithOrderId = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsWithOrderId);

    if (itemsError) {
      console.error("Order items creation failed:", itemsError);
      // Order was created but items failed — still return order
    }

    // Decrement stock for each product (using service role would be better in production)
    for (const item of body.items) {
      const dbProduct = priceMap.get(item.id);
      if (dbProduct) {
        await supabase
          .from("products")
          .update({ stock: dbProduct.stock - item.quantity })
          .eq("id", item.id);
      }
    }

    // Clear the user's cart
    await supabase.from("cart_items").delete().eq("user_id", user.id);

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.status,
        total: order.total,
        created_at: order.created_at,
      },
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
