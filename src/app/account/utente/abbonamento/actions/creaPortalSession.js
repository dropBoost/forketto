"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { createCustomerPortalSession } from "@/lib/stripe/portal";

export async function creaPortalSession() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/account/utente/accesso");
  }

  const { data: utente, error: utenteError } = await supabase
    .from("utente")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (utenteError || !utente) {
    throw new Error(
      utenteError?.message || "Utente non trovato"
    );
  }

  if (!utente.stripe_customer_id) {
    redirect("/account/utente/checkout");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!appUrl) {
    throw new Error(
      "NEXT_PUBLIC_APP_URL non configurata"
    );
  }

  const portalSession =
    await createCustomerPortalSession({
      customerId: utente.stripe_customer_id,
      returnUrl:
        `${appUrl}/account/utente/abbonamento`,
    });

  if (!portalSession.url) {
    throw new Error(
      "Stripe non ha restituito la URL del Customer Portal"
    );
  }

  redirect(portalSession.url);
  
}