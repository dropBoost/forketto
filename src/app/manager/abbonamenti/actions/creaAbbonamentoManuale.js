"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

async function verificaOperatore() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Devi effettuare l'accesso.");
  }

  const { data: profilo, error: profiloError } =
    await supabaseAdmin
      .from("utente")
      .select("ruolo, attivo")
      .eq("id", user.id)
      .maybeSingle();

  if (
    profiloError ||
    !profilo ||
    !profilo.attivo ||
    profilo.ruolo !== "HRC"
  ) {
    throw new Error("Non puoi creare abbonamenti.");
  }

  // Qui aggiungerai in seguito il permesso specifico.
  return user;
}

export async function creaAbbonamentoManuale(
  previousState,
  formData
) {
  try {
    await verificaOperatore();

    const pianoId = String(
      formData.get("pianoId") ?? ""
    ).trim();

    const modalita = String(
      formData.get("modalita") ?? ""
    ).trim();

    const { data: piano, error: pianoError } =
      await supabaseAdmin
        .from("piano_abbonamento")
        .select("id")
        .eq("id", pianoId)
        .eq("attivo", true)
        .maybeSingle();

    if (pianoError || !piano) {
      throw new Error("Seleziona un piano valido.");
    }

    let utenteId;

    if (modalita === "esistente") {
      utenteId = String(
        formData.get("clienteEsistenteId") ?? ""
      ).trim();

      if (!utenteId) {
        throw new Error("Seleziona un cliente.");
      }

      const { data: cliente, error: clienteError } =
        await supabaseAdmin
          .from("utente")
          .select("id, ruolo, attivo")
          .eq("id", utenteId)
          .maybeSingle();

      if (
        clienteError ||
        !cliente ||
        !cliente.attivo ||
        cliente.ruolo !== "HRC"
      ) {
        throw new Error("Cliente non trovato o non attivo.");
      }
    } else if (modalita === "nuovo") {
      const nome = String(
        formData.get("nome") ?? ""
      ).trim();

      const cognome = String(
        formData.get("cognome") ?? ""
      ).trim();

      const email = String(
        formData.get("email") ?? ""
      )
        .trim()
        .toLowerCase();

      const telefono =
        String(formData.get("telefono") ?? "").trim() ||
        null;

      if (
        !nome ||
        !cognome ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        throw new Error(
          "Inserisci nome, cognome ed email validi."
        );
      }

      const { data: esistente, error: ricercaError } =
        await supabaseAdmin
          .from("utente")
          .select("id")
          .eq("email", email)
          .maybeSingle();

      if (ricercaError) throw ricercaError;

      if (esistente) {
        throw new Error(
          "Questa email è già registrata. Seleziona il cliente esistente."
        );
      }


      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.NEXT_PUBLIC_SITE_URL;

      if (!appUrl) {
        throw new Error(
          "Configura NEXT_PUBLIC_APP_URL o NEXT_PUBLIC_SITE_URL."
        );
      }

      const confirmUrl = new URL(
        "/account/utente/auth/confirm",
        appUrl
      ).toString();

      const { data: invito, error: invitoError } =
        await supabaseAdmin.auth.admin.inviteUserByEmail(
          email,
          {
            redirectTo: confirmUrl,
            data: {
              nome,
              cognome,
              telefono,
            },
          }
        );


      if (invitoError || !invito?.user?.id) {
        throw new Error(
          invitoError?.message ||
            "Impossibile creare e invitare l'utente."
        );
      }

      utenteId = invito.user.id;

      const { error: utenteError } =
        await supabaseAdmin.from("utente").insert({
          id: utenteId,
          nome,
          cognome,
          email,
          telefono,
          ruolo: "HRC",
          attivo: true,
        });

      if (utenteError) {
        throw new Error(
          `L'invito è stato inviato, ma il profilo non è stato creato: ${utenteError.message}`
        );
      }
    } else {
      throw new Error(
        "Scegli se creare un cliente o selezionarne uno esistente."
      );
    }

    const { data: giaPresente, error: verificaError } =
      await supabaseAdmin
        .from("abbonamento")
        .select("id")
        .eq("utente", utenteId)
        .maybeSingle();

    if (verificaError) throw verificaError;

    if (giaPresente) {
      throw new Error(
        "Questo cliente ha già un abbonamento. Per un rinnovo registra un nuovo pagamento."
      );
    }

    const { error: abbonamentoError } =
      await supabaseAdmin
        .from("abbonamento")
        .insert({
          utente: utenteId,
          id_piano_abbonamento: piano.id,
          origine: "manuale",
          stripe_customer_id: null,
          stripe_subscription_id: null,
          stripe_price_id: null,
          status: "pending_manual_payment",
          current_period_start: null,
          current_period_end: null,
          data_scadenza_manuale: null,
          last_manual_operation_id: null,
          cancel_at_period_end: false,
          canceled_at: null,
        });

    if (abbonamentoError) {
      throw abbonamentoError;
    }

    revalidatePath("/manager/abbonamenti");

    return {
      success: true,
      message:
        "Cliente e abbonamento creati. L'abbonamento è in attesa di pagamento.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.message ||
        "Errore durante la creazione dell'abbonamento.",
    };
  }
}