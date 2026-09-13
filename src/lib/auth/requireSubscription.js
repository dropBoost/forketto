import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { syncStripeSubscription } from "@/lib/stripe/subscription";

const STATI_STRIPE_ABILITATI = ["active", "trialing"];

function periodoValido(fine) {
  if (!fine) return false;

  const timestamp = new Date(fine).getTime();
  return Number.isFinite(timestamp) && timestamp > Date.now();
}

export async function requireSubscription() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/account/utente/accesso?redirectTo=%2Fmanager");
  }

  const { data: utente, error: utenteError } = await supabase
    .from("utente")
    .select("id, nome, cognome, email, attivo, ruolo")
    .eq("id", user.id)
    .maybeSingle();

  if (utenteError) {
    throw new Error(
      `Errore durante il recupero dell'utente: ${utenteError.message}`
    );
  }

  if (!utente || utente.attivo !== true) {
    redirect("/account/utente/accesso?error=utente-non-attivo");
  }

  if (!["HRC", "SAM", "ADM"].includes(utente.ruolo)) {
    redirect("/");
  }

  if (["SAM", "ADM"].includes(utente.ruolo)) {
    return {
      authUser: user,
      utente,
      abbonamento: null,
      piano: null,
    };
  }

  const { data: abbonamento, error: abbonamentoError } = await supabase
    .from("abbonamento")
    .select(`
      id,
      utente,
      id_piano_abbonamento,
      origine,
      data_scadenza_manuale,
      stripe_customer_id,
      stripe_subscription_id,
      stripe_price_id,
      status,
      current_period_start,
      current_period_end,
      cancel_at_period_end,
      canceled_at,
      piano_abbonamento (
        id,
        nome,
        descrizione,
        durata,
        costo,
        attivo
      )
    `)
    .eq("utente", user.id)
    .maybeSingle();

  if (abbonamentoError) {
    throw new Error(
      `Errore durante il controllo dell'abbonamento: ${abbonamentoError.message}`
    );
  }

  if (!abbonamento) {
    redirect("/account/utente/checkout?error=abbonamento-mancante");
  }

  if (abbonamento.origine === "manuale") {
    if (abbonamento.status !== "active") {
      redirect(
        "/account/utente/abbonamento?error=pending_manual_payment"
      );
    }

    if (
      !abbonamento.data_scadenza_manuale ||
      !periodoValido(abbonamento.current_period_end)
    ) {
      redirect(
        "/account/utente/abbonamento?error=abbonamento-scaduto"
      );
    }

    if (abbonamento.piano_abbonamento?.attivo === false) {
      redirect(
        "/account/utente/abbonamento?error=piano-non-disponibile"
      );
    }

    return {
      authUser: user,
      utente,
      abbonamento,
      piano: abbonamento.piano_abbonamento,
    };
  }

  let abbonamentoVerificato = abbonamento;

  if (
    abbonamento.current_period_end &&
    !periodoValido(abbonamento.current_period_end)
  ) {
    if (!abbonamento.stripe_subscription_id) {
      redirect(
        "/account/utente/abbonamento?error=verifica-abbonamento"
      );
    }

    try {
      const { dati } = await syncStripeSubscription(
        abbonamento.stripe_subscription_id
      );

      abbonamentoVerificato = {
        ...abbonamento,
        ...dati,
        piano_abbonamento: abbonamento.piano_abbonamento,
      };
    } catch (error) {
      console.error("Errore sincronizzazione Stripe:", error);
      redirect(
        "/account/utente/abbonamento?error=verifica-abbonamento"
      );
    }
  }

  if (
    !STATI_STRIPE_ABILITATI.includes(
      abbonamentoVerificato.status
    )
  ) {
    redirect(
      `/account/utente/abbonamento?error=${encodeURIComponent(
        abbonamentoVerificato.status || "abbonamento-non-attivo"
      )}`
    );
  }

  if (
    !periodoValido(abbonamentoVerificato.current_period_end)
  ) {
    redirect(
      "/account/utente/abbonamento?error=abbonamento-scaduto"
    );
  }

  if (
    abbonamentoVerificato.piano_abbonamento?.attivo === false
  ) {
    redirect(
      "/account/utente/abbonamento?error=piano-non-disponibile"
    );
  }

  return {
    authUser: user,
    utente,
    abbonamento: abbonamentoVerificato,
    piano: abbonamentoVerificato.piano_abbonamento,
  };
}