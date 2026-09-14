import { createClient } from "@/utils/supabase/server";

export async function getHorecaThemeByID(id) {
  if (!id) return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("horeca_configurazione")
    .select("settings")
    .eq("id_horeca", id)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw error;
  }

  const settings = data?.settings ?? {};

  return {
    cover: {
      backgroundImage: `url(${settings.cover || "/assets/img/placeholder.png"})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },

    logo: {
      backgroundImage: `url(${settings.logo || "/assets/img/placeholder.png"})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },

    header: {
      backgroundColor: settings.colore || "#ffcc05",
      color: settings.coloreTestoHeader || "#000000",
    },
    alias: {
      color: "#ffffff",
    },
    socialIcon: {
      color: "#ffffff",
    },

    title: {
      color: settings.colore || "#ffcc05",
    },
    price: {
      color: "#333333",
    }
  };
}