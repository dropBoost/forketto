import { createClient } from "@/utils/supabase/server";

export async function getHorecaCategorieByID(id) {

  const db = await createClient();

  const { data, error } = await db
    .from("horeca_classificazione")
    .select(`alias,
      categoria:horeca_cateogria(alias)
      `)
    .eq("id_horeca", id)
    .order("alias", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}