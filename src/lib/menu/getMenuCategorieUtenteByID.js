import { createClient } from "@/utils/supabase/server";

export async function getMenuCategorieUtenteByID(id) {

  const db = await createClient();

  const { data, error } = await db
    .from("menu_categoria_horeca")
    .select(`*,
      supercategoria:menu_supercategoria(alias)
      `)
    .eq("id_horeca", id)

  if (error) {
    throw error;
  }

  return data ?? [];
}