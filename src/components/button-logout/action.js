"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function logoutUtenteAction() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/account/utente/accesso");
}