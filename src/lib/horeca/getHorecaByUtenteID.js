import { createClient } from "@/utils/supabase/server";

export async function getHorecaByUtenteID(id) {

  const db = await createClient();

  const { data, error } = await db
    .from("horeca")
    .select(`*,
      settings:horeca_configurazione(settings)
      `)
    .eq("id_utente", id)
    .order("alias", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}