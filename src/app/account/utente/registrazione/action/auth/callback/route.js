import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/account/utente/accesso?error=no-code`);
  }

  const supabase = await createClient();

  const { error: sessionError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (sessionError) {
    return NextResponse.redirect(`${requestUrl.origin}/account/utente/accesso?error=session`);
  }

  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData.user) {
    return NextResponse.redirect(`${requestUrl.origin}/account/utente/accesso?error=user`);
  }

  const user = userData.user;
  const metadata = user.user_metadata;

  const { error: insertError } = await supabase
    .from("utente")
    .upsert(
      {
        id: user.id,
        email: user.email,
        nome: metadata?.nome,
        cognome: metadata?.cognome,
        telefono: metadata?.telefono,
        data_nascita: metadata?.data_nascita,
        attivo: true,
        ruolo: "HRC",
      },
      {
        onConflict: "id",
      }
    );

  if (insertError) {
    return NextResponse.redirect(
      `${requestUrl.origin}/account/utente/accesso?error=${encodeURIComponent(insertError.message)}`
    );
  }

  return NextResponse.redirect(`${requestUrl.origin}/account/utente/dashboard`);
}