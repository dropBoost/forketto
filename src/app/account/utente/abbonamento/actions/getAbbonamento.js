"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAbbonamento() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Utente non autenticato");
  }

  const { data, error } = await supabase
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
      created_at,
      updated_at,
      piano_abbonamento (
        id,
        nome,
        descrizione,
        costo,
        durata
      )
    `)
    .eq("utente", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Errore recupero abbonamento: ${error.message}`
    );
  }

  return data;
}