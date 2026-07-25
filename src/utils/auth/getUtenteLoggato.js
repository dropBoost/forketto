import { createClient } from "@/utils/supabase/server";

export async function getUtenteLoggato() {
  
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: utente } = await supabase
    .from("utente")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!utente) return null;

  return {
    auth: user,
    utente,
  };
}