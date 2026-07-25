"use server";

import { createClient } from "@/utils/supabase/server";

export async function verificaAliasHorecaAction(alias) {
  
  const aliasNormalizzato = alias
    ?.trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "")

  if (!aliasNormalizzato || aliasNormalizzato.length < 2) {
    return {
      disponibile: false,
      alias: aliasNormalizzato ?? "",
      message: "Inserisci almeno 2 caratteri.",
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      disponibile: false,
      alias: aliasNormalizzato,
      message: "Sessione utente non valida.",
    };
  }

  const { data, error } = await supabase
    .from("horeca")
    .select("id")
    .eq("alias", aliasNormalizzato)
    .maybeSingle();

  if (error) {
    console.error("Errore controllo alias:", error);

    return {
      disponibile: false,
      alias: aliasNormalizzato,
      message: "Errore durante il controllo.",
    };
  }

  return {
    disponibile: !data,
    alias: aliasNormalizzato,
    message: data
      ? "Alias già utilizzato."
      : "Alias disponibile.",
  };
}