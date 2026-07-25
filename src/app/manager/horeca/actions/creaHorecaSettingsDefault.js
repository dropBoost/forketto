import { createClient } from "@/utils/supabase/server";

export async function creaHorecaSettingsDefault(idHoreca) {
  const db = await createClient();

  const { data, error } = await db
    .from("horeca_configurazione")
    .insert({
      id_horeca: idHoreca,
      settings: {
        colore: null,
        coloreTestoHeader: "dark",
        logo: null,
        cover: null,
        tiktok: null,
        instagram: null,
        facebook: null,
        email: null,
        whatsapp: null,
        maps: true,
        prenotazioni: false,
      },
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}