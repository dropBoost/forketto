// lib/horeca/getHorecaConfigurazioneByID.js

import { createClient } from "@/utils/supabase/server";

export async function getHorecaConfigurazioneByID(idHoreca) {
  if (!idHoreca) return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("horeca_configurazione")
    .select("*")
    .eq("id_horeca", idHoreca)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}