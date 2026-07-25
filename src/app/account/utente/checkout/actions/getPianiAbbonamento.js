"use server";

import { createClient } from "@/utils/supabase/server";

export async function getPianiAbbonamento() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("piano_abbonamento")
    .select("*")
    .eq("attivo", true)
    .order("costo", { ascending: true });

  if (error) throw error;

  return data;
}