"use server";

import { createClient } from "@/utils/supabase/server";

export async function getRegistroAbbonamenti() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Utente non autenticato");
  }

  const { data, error } = await supabase
    .from("registro_abbonamento")
    .select(`
      id,
      id_piano_abbonamento,
      utente,
      data_pagamento,
      durata,
      costo,
      stripe_customer_id,
      stripe_subscription_id,
      stripe_invoice_id,
      stripe_invoice_pdf,
      stripe_invoice_hosted_url,
      created_at,
      piano_abbonamento (
        id,
        nome
      )
    `)
    .eq("utente", user.id)
    .order("data_pagamento", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Errore recupero pagamenti: ${error.message}`
    );
  }

  return data ?? [];
}