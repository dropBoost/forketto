"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

function getConfirmUrl() {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL;

  if (!appUrl) {
    throw new Error(
      "Configura NEXT_PUBLIC_APP_URL o NEXT_PUBLIC_SITE_URL."
    );
  }

  return new URL(
    "/account/utente/auth/confirm",
    appUrl
  ).toString();
}

export async function richiediRecuperoPassword(formData) {
  const email = String(
    formData.get("email") ?? ""
  )
    .trim()
    .toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect(
      "/account/utente/recupera-password?error=email"
    );
  }

  const supabase = await createClient();

  const { error } =
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getConfirmUrl(),
    });

  if (error) {
    console.error(
      "Errore invio email di recupero:",
      error
    );

    redirect(
      "/account/utente/recupera-password?error=invio"
    );
  }

  redirect(
    "/account/utente/recupera-password?inviata=1"
  );
}

export async function impostaPassword(formData) {
  const password = String(
    formData.get("password") ?? ""
  );

  const conferma = String(
    formData.get("confermaPassword") ?? ""
  );

  if (password.length < 12) {
    redirect(
      "/account/utente/imposta-password?error=lunghezza"
    );
  }

  if (password !== conferma) {
    redirect(
      "/account/utente/imposta-password?error=conferma"
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(
      "/account/utente/recupera-password?error=sessione"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error(
      "Errore impostazione password:",
      error
    );

    redirect(
      "/account/utente/imposta-password?error=salvataggio"
    );
  }

  await supabase.auth.signOut();

  redirect(
    "/account/utente/accesso?password-impostata=1"
  );
}