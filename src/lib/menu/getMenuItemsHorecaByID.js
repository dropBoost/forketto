import { createClient } from "@/utils/supabase/server";

export async function getMenuHorecaByID(id) {

  const db = await createClient();

  const { data, error } = await db
    .from("menu")
    .select(`*,
      categoria:menu_categoria(id_supercategoria,alias,order,
        supercategoria:menu_supercategoria(alias)
      )
    `)
    .order("id_categoria", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}