"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2 } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (submitError) {
      setError(submitError.message ?? "Payment failed. Please try again.");
    }
    setProcessing(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      <p className="text-muted-foreground">Complete your purchase securely.</p>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <PaymentElement />
      </div>
      {error && (
        <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3">
          {error}
        </div>
      )}
      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold"
        disabled={processing || !stripe}
      >
        {processing ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
        ) : (
          "Pay Now"
        )}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" /> Secured by Stripe
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise} options={{ appearance: { theme: "stripe" } }}>
      <CheckoutForm />
    </Elements>
  );
}
