import { createClient } from "@/utils/supabase/server";

export async function getUtente() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  if (!user) return null;

  const { data, error } = await supabase
    .from("utente")
    .select(`*,
      dati_fatturazione:utente_dati_fatturazione(*),
      horeca:horeca(*,
        settings:horeca_configurazione(settings)
      ),
      abbonamento:abbonamento(*)`)
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return data;
}