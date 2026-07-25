"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function registraUtente(formData) {
  const supabase = await createClient();

  const nome = formData.get("nome");
  const cognome = formData.get("cognome");
  const email = formData.get("email");
  const telefono = formData.get("telefono");
  const data_nascita = formData.get("data_nascita");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm_password");

  if (password !== confirmPassword) {
    redirect("/registrazione?error=password");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/account/utente/registrazione/action/auth/callback`,
      data: {
        nome,
        cognome,
        telefono,
        data_nascita,
      },
    },
  });

  if (error) {
    redirect(`/registrazione?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/registrazione/conferma-email");
}