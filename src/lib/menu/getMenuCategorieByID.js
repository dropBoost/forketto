import { createClient } from "@/utils/supabase/server";

export async function getMenuCategorieByID(id) {

  const db = await createClient();

  const { data, error } = await db
    .from("menu_categoria")
    .select(`*,
      supercategoria:menu_supercategoria(alias)
      `)
    .eq("id", id)
    .maybeSingle()

  if (error) {
    throw error;
  }

  return data ?? [];
}