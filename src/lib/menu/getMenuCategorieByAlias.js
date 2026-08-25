import { createClient } from "@/utils/supabase/server";

export async function getMenuCategorieByAlias(alias) {

  const db = await createClient();

  const { data, error } = await db
    .from("menu_categoria")
    .select(`*,
      supercategoria:menu_supercategoria(alias)
      `)
    .eq("alias", alias)
    .maybeSingle()

  if (error) {
    throw error;
  }

  return data ?? [];
}