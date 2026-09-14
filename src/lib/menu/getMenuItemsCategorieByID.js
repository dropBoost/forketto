import { createClient } from "@/utils/supabase/server";

export async function getMenuItemsCategorieByID(id) {

  const db = await createClient();

  const { data, error } = await db
    .from("menu")
    .select(`*,
      horeca:horeca(*),
      categoria:menu_categoria_horeca(*)
      `)
    .eq("attivo", true)
    .eq("categoria.id_categoria", id)
    .order("vetrina", { ascending: true })

  if (error) {
    throw error;
  }

  return data ?? [];
}