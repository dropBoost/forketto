import { stripe } from "@/lib/stripe/client";

export async function createSubscriptionCheckout({
  customerId,
  userId,
  piano,
  appUrl,
}) {
  if (!customerId) {
    throw new Error("Stripe Customer ID mancante");
  }

  if (!userId) {
    throw new Error("ID utente mancante");
  }

  if (!piano?.id || !piano?.stripe_price_id) {
    throw new Error("Piano Stripe non valido");
  }

  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL non configurata");
  }

  return stripe.checkout.sessions.create({
    mode: "subscription",

    customer: customerId,

    line_items: [
      {
        price: piano.stripe_price_id,
        quantity: 1,
      },
    ],

    metadata: {
      utente: userId,
      id_piano_abbonamento: piano.id,
    },

    subscription_data: {
      metadata: {
        utente: userId,
        id_piano_abbonamento: piano.id,
      },
    },

    success_url:
      `${appUrl}/account/utente/checkout/return` +
      "?session_id={CHECKOUT_SESSION_ID}",

    cancel_url:
      `${appUrl}/account/utente/checkout`,
  });
}