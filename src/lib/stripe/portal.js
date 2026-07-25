import { stripe } from "@/lib/stripe/client";

export async function createCustomerPortalSession({ customerId, returnUrl }) {

  if (!customerId) {
    throw new Error("Stripe Customer ID mancante");
  }

  if (!returnUrl) {
    throw new Error("URL di ritorno mancante");
  }

  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  
}