import { createClient } from "@/utils/supabase/server";

export async function getMenuSupercategorie() {

  const db = await createClient();

  const { data, error } = await db
    .from("menu_supercategoria")
    .select(`*`)
    .order("order", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}