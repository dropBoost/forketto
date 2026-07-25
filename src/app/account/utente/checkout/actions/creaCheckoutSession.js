"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { getOrCreateStripeCustomer } from "@/lib/stripe/customer";
import { createSubscriptionCheckout } from "@/lib/stripe/checkout";

export async function creaCheckoutSession(formData) {
  const idPiano = formData.get("idPiano");

  if (!idPiano) {
    throw new Error("ID piano mancante");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/account/utente/accesso");
  }

  const { data: piano, error: pianoError } =
    await supabase
      .from("piano_abbonamento")
      .select(
        "id, nome, stripe_price_id, costo, durata"
      )
      .eq("id", idPiano)
      .eq("attivo", true)
      .single();

  if (pianoError || !piano) {
    throw new Error(
      pianoError?.message ||
        "Piano abbonamento non trovato"
    );
  }

  const customerId =
    await getOrCreateStripeCustomer(
      supabase,
      user
    );

  const session =
    await createSubscriptionCheckout({
      customerId,
      userId: user.id,
      piano,
      appUrl:
        process.env.NEXT_PUBLIC_APP_URL,
    });

  if (!session.url) {
    throw new Error(
      "Stripe non ha restituito la URL del Checkout"
    );
  }

  redirect(session.url);
}