/**
 * Stripe integration placeholder.
 * Payment flow is currently mocked — orders are created without real Stripe charges.
 * To enable real payments:
 *   1. Set STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env
 *   2. Uncomment Stripe client initialization below
 *   3. Update the checkout API route to create a PaymentIntent
 */

// import Stripe from "stripe";
//
// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-04-10",
//   typescript: true,
// });

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
