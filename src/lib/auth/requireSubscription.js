import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

const STATI_ABILITATI = ["active", "trialing"];

export async function requireSubscription() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(
      "/account/utente/accesso?redirectTo=%2Fmanager"
    );
  }

  const { data: utente, error: utenteError } = await supabase
    .from("utente")
    .select(`
      *
    `)
    .eq("id", user.id)
    .maybeSingle();

  if (utenteError) {
    throw new Error(
      `Errore durante il recupero dell'utente: ${utenteError.message}`
    );
  }

  if (!utente || utente.attivo !== true) {
    redirect(
      "/account/utente/accesso?error=utente-non-attivo"
    );
  }

  const { data: abbonamento, error: abbonamentoError } =
    await supabase
      .from("abbonamento")
      .select(`
        id,
        utente,
        id_piano_abbonamento,
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
    redirect(
      "/account/utente/checkout?error=abbonamento-mancante"
    );
  }

  if (!STATI_ABILITATI.includes(abbonamento.status)) {
    redirect(
      `/account/utente/abbonamento?error=${encodeURIComponent(
        abbonamento.status || "abbonamento-non-attivo"
      )}`
    );
  }

  if (abbonamento.current_period_end) {
    const scadenza = new Date(
      abbonamento.current_period_end
    );

    if (
      Number.isNaN(scadenza.getTime()) ||
      scadenza.getTime() <= Date.now()
    ) {
      redirect(
        "/account/utente/abbonamento?error=abbonamento-scaduto"
      );
    }
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