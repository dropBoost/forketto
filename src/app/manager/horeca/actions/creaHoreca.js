"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { horecaSchema } from "@/lib/schema/horecaSchema";

export async function creaHorecaAction(prevState, formData) {

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: "Sessione non valida. Effettua nuovamente l'accesso.",
      errors: {},
      values: {},
    };
  }

  const values = {
    nome: formData.get("nome")?.toString() ?? "",
    alias: formData.get("alias")?.toString() ?? "",
    provincia: formData.get("provincia")?.toString() ?? "",
    citta: formData.get("citta")?.toString() ?? "",
    cap: formData.get("cap")?.toString() ?? "",
    indirizzo: formData.get("indirizzo")?.toString() ?? "",
    civico: formData.get("civico")?.toString() ?? "",
    attivo: formData.get("attivo") === "on",
  };

  const validation = horecaSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "Controlla i campi evidenziati.",
      errors: validation.error.flatten().fieldErrors,
      values,
    };
  }

  const { data: utente, error: utenteError } = await supabase
    .from("utente")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (utenteError) {
    console.error("Errore recupero utente:", utenteError);

    return {
      success: false,
      message: "Errore durante il recupero dell'utente.",
      errors: {},
      values,
    };
  }

  if (!utente) {
    return {
      success: false,
      message: "Il profilo utente non è stato trovato.",
      errors: {},
      values,
    };
  }

  const { data: abbonamento, error: abbonamentoError } = await supabase
    .from("abbonamento")
    .select(`
      *,
      piano:piano_abbonamento(*)
    `)
    .eq("utente", user.id)
    .maybeSingle();

  if (abbonamentoError) {
    console.error(abbonamentoError);

    return {
      success: false,
      message: "Errore durante il recupero dell'abbonamento.",
      errors: {},
      values,
    };
  }

  if (!abbonamento?.piano) {
    return {
      success: false,
      message: "Nessun piano di abbonamento attivo trovato.",
      errors: {},
      values,
    };
  }

  const { count: numeroHoreca, error: horecaError } = await supabase
    .from("horeca")
    .select("id", { count: "exact", head: true })
    .eq("id_utente", user.id);

  if (horecaError) {
    console.error(horecaError);

    return {
      success: false,
      message: "Errore durante il conteggio delle attività.",
      errors: {},
      values,
    };
  }

  const limiteHoreca = abbonamento.piano.limite_horeca;
  const totaleAttuale = numeroHoreca ?? 0;

  if (totaleAttuale + 1 > limiteHoreca) {
    console.error(
      `Raggiunto limite massimo horeca: ${totaleAttuale}/${limiteHoreca}`
    );

    return {
      success: false,
      message: `Hai raggiunto il limite massimo di ${limiteHoreca} attività previsto dal tuo piano.`,
      errors: {},
      values,
    };
  }

  const { error } = await supabase.from("horeca").insert({
    nome: validation.data.nome,
    alias: validation.data.alias,
    provincia: validation.data.provincia || null,
    citta: validation.data.citta,
    cap: validation.data.cap,
    indirizzo: validation.data.indirizzo,
    civico: validation.data.civico,
    attivo: validation.data.attivo,
    id_utente: utente.id,
  });

  if (error) {
    console.error("Errore creazione Horeca:", error);

    if (error.code === "23505") {
      return {
        success: false,
        message: "Esiste già un'attività con questo alias.",
        errors: {
          alias: ["Questo alias è già utilizzato"],
        },
        values,
      };
    }

    return {
      success: false,
      message: "Non è stato possibile creare l'attività.",
      errors: {},
      values,
    };
  }

  
  
  revalidatePath("/manager/horeca");

  return {
    success: true,
    message: "Attività Horeca creata correttamente.",
    errors: {},
    values: {},
  };
}