import { redirect } from "next/navigation"

import { createClient } from "@/utils/supabase/server"
import { syncStripeSubscription } from "@/lib/stripe/subscription"

const STATI_ABILITATI = ["active", "trialing"]

export async function requireSubscription() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect(
      "/account/utente/accesso?redirectTo=%2Fmanager"
    )
  }

  // Recupero utente
  const { data: utente, error: utenteError } =
    await supabase
      .from("utente")
      .select(`
        id,
        nome,
        cognome,
        email,
        attivo,
        ruolo
      `)
      .eq("id", user.id)
      .maybeSingle()

  if (utenteError) {
    throw new Error(
      `Errore durante il recupero dell'utente: ${utenteError.message}`
    )
  }

  if (!utente || utente.attivo !== true) {
    redirect(
      "/account/utente/accesso?error=utente-non-attivo"
    )
  }

  // Recupero abbonamento dal database
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
      .maybeSingle()

  if (abbonamentoError) {
    throw new Error(
      `Errore durante il controllo dell'abbonamento: ${abbonamentoError.message}`
    )
  }

  // Nessun abbonamento
  if (!abbonamento) {
    redirect(
      "/account/utente/checkout?error=abbonamento-mancante"
    )
  }

  /*
   * Partiamo dai dati presenti su Supabase.
   * Se scopriamo che il periodo è scaduto,
   * proviamo a risincronizzare con Stripe.
   */
  let abbonamentoVerificato = abbonamento

  if (abbonamento.current_period_end) {
    const scadenza = new Date(
      abbonamento.current_period_end
    )

    const periodoScaduto =
      !Number.isNaN(scadenza.getTime()) &&
      scadenza.getTime() <= Date.now()

    if (periodoScaduto) {
      try {
        const { dati } =
          await syncStripeSubscription(
            abbonamento.stripe_subscription_id
          )

        /*
         * dati contiene lo stato aggiornato
         * recuperato direttamente da Stripe.
         */
        abbonamentoVerificato = {
          ...abbonamento,
          ...dati,

          // Manteniamo la relazione del piano
          // recuperata dalla query Supabase.
          piano_abbonamento:
            abbonamento.piano_abbonamento,
        }
      } catch (error) {
        console.error(
          "Errore sincronizzazione Stripe:",
          error
        )

        redirect(
          "/account/utente/abbonamento?error=verifica-abbonamento"
        )
      }
    }
  }

  /*
   * IMPORTANTE:
   * da questo momento NON utilizziamo più
   * "abbonamento", ma "abbonamentoVerificato".
   *
   * Se Stripe ha rinnovato l'abbonamento,
   * qui avremo già i nuovi dati.
   */

  // Controllo stato Stripe
  if (
    !STATI_ABILITATI.includes(
      abbonamentoVerificato.status
    )
  ) {
    redirect(
      `/account/utente/abbonamento?error=${encodeURIComponent(
        abbonamentoVerificato.status ||
          "abbonamento-non-attivo"
      )}`
    )
  }

  // Controllo nuova scadenza
  if (
    abbonamentoVerificato.current_period_end
  ) {
    const nuovaScadenza = new Date(
      abbonamentoVerificato.current_period_end
    )

    if (
      !Number.isNaN(nuovaScadenza.getTime()) &&
      nuovaScadenza.getTime() <= Date.now()
    ) {
      redirect(
        "/account/utente/abbonamento?error=abbonamento-scaduto"
      )
    }
  }

  // Controllo che il piano esista ancora
  if (
    abbonamentoVerificato
      .piano_abbonamento?.attivo === false
  ) {
    redirect(
      "/account/utente/abbonamento?error=piano-non-disponibile"
    )
  }

  return {
    authUser: user,
    utente,
    abbonamento: abbonamentoVerificato,
    piano:
      abbonamentoVerificato
        .piano_abbonamento,
  }
}