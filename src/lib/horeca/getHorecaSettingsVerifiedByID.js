import { createClient } from "@/utils/supabase/server";

export async function getHorecaSettingsVerifiedByID(id) {

  const db = await createClient();

  const { data, error } = await db
    .from("horeca_configurazione")
    .select(`*`)
    .eq("id_horeca", id)
    .maybeSingle()

  if (error) {
    throw error;
  }

  if (data) return true
  if (!data) return false
  
}