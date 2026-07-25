import { createClient } from "@/utils/supabase/server";

export async function getMenuCategorie() {

  const db = await createClient();

  const { data, error } = await db
    .from("menu_categoria")
    .select(`*,
      supercategoria:menu_supercategoria(alias)
      `)
    .order("alias", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}