"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function loginUtenteAction(formData) {
  const supabase = await createClient();

  const email = formData.get("email")?.trim().toLowerCase();
  const password = formData.get("password");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: "Email o password non corretti.",
    };
  }

  const { data: utente, error: utenteError } = await supabase
    .from("utente")
    .select("id, ruolo")
    .eq("id", data.user.id)
    .eq("ruolo", "HRC")
    .single();

  if (utenteError || !utente) {
    await supabase.auth.signOut();

    return {
      success: false,
      message: "Non sei autorizzato ad accedere alla piattaforma Horeca.",
    };
  }

  redirect("/manager");
}