import { stripe } from "@/lib/stripe/client";
import { supabaseAdmin } from "@/utils/supabase/admin";

function timestampToIso(timestamp) {
  if (!timestamp) return null;

  return new Date(timestamp * 1000).toISOString();
}

function getSubscriptionPeriod(subscription) {
  const item = subscription.items?.data?.[0];

  return {
    currentPeriodStart:
      item?.current_period_start ??
      subscription.current_period_start ??
      null,

    currentPeriodEnd:
      item?.current_period_end ??
      subscription.current_period_end ??
      null,
  };
}

export async function syncStripeSubscription(
  stripeSubscriptionId
) {
  if (!stripeSubscriptionId) {
    throw new Error("Stripe Subscription ID mancante");
  }

  /*
   * Stripe diventa la fonte di verità.
   */
  const subscription =
    await stripe.subscriptions.retrieve(
      stripeSubscriptionId
    );

  const utente = subscription.metadata?.utente;

  let idPianoAbbonamento =
    subscription.metadata?.id_piano_abbonamento;

  const item = subscription.items?.data?.[0];

  const stripePriceId =
    item?.price?.id ?? null;

  if (!utente) {
    throw new Error(
      `Metadata utente mancante nella subscription ${subscription.id}`
    );
  }

  /*
   * Fallback:
   * se manca il nostro id piano nei metadata,
   * lo recuperiamo tramite Stripe Price ID.
   */
  if (!idPianoAbbonamento && stripePriceId) {
    const { data: piano, error } =
      await supabaseAdmin
        .from("piano_abbonamento")
        .select("id")
        .eq("stripe_price_id", stripePriceId)
        .single();

    if (error || !piano) {
      throw new Error(
        `Piano non trovato per ${stripePriceId}`
      );
    }

    idPianoAbbonamento = piano.id;
  }

  const {
    currentPeriodStart,
    currentPeriodEnd,
  } = getSubscriptionPeriod(subscription);

  const dati = {
    utente,

    id_piano_abbonamento:
      idPianoAbbonamento,

    stripe_customer_id:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id,

    stripe_subscription_id:
      subscription.id,

    stripe_price_id:
      stripePriceId,

    status:
      subscription.status,

    current_period_start:
      timestampToIso(currentPeriodStart),

    current_period_end:
      timestampToIso(currentPeriodEnd),

    cancel_at_period_end:
      subscription.cancel_at_period_end ?? false,

    canceled_at:
      timestampToIso(subscription.canceled_at),

    updated_at:
      new Date().toISOString(),
  };

  const { data: esistente, error: letturaError } = await supabaseAdmin
    .from("abbonamento")
    .select("origine")
    .eq("utente", utente)
    .maybeSingle();

  if (letturaError) {
    throw new Error(letturaError.message);
  }

  if (esistente?.origine === "manuale") {
    throw new Error(
      "Sincronizzazione Stripe bloccata: abbonamento manuale esistente"
    );
  }

  dati.origine = "stripe";
  dati.data_scadenza_manuale = null;
  dati.last_manual_operation_id = null;

  const { error } = await supabaseAdmin
    .from("abbonamento")
    .upsert(dati, {
      onConflict: "utente",
    });

  if (error) {
    throw new Error(
      `Errore sincronizzazione abbonamento: ${error.message}`
    );
  }

  return {
    subscription,
    dati,
  };
}