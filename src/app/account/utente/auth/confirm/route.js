import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  const erroreUrl = new URL(
    "/account/utente/recupera-password?error=link",
    url.origin
  );

  if (
    !tokenHash ||
    !["invite", "recovery"].includes(type)
  ) {
    return NextResponse.redirect(erroreUrl);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    return NextResponse.redirect(erroreUrl);
  }

  return NextResponse.redirect(
    new URL(
      "/account/utente/imposta-password",
      url.origin
    )
  );
}