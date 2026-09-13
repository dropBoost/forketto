"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
    throw new Error("Non puoi registrare pagamenti.");
  }

  // Qui aggiungerai in seguito il permesso specifico.
}

function dataValida(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const data = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(data.getTime()) &&
    data.toISOString().slice(0, 10) === value
  );
}

// La scadenza impostata nel form è inclusiva:
// "31 ottobre" significa accesso fino alla fine del 31.
function fineDelGiornoInItalia(dataScadenza) {
  if (!dataValida(dataScadenza)) {
    throw new Error("Data di scadenza non valida.");
  }

  const giornoSuccessivo = new Date(
    `${dataScadenza}T00:00:00.000Z`
  );

  giornoSuccessivo.setUTCDate(
    giornoSuccessivo.getUTCDate() + 1
  );

  const dataSuccessiva = giornoSuccessivo
    .toISOString()
    .slice(0, 10);

  const nomeFuso = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: "Europe/Rome",
      timeZoneName: "shortOffset",
      hour: "2-digit",
    }
  )
    .formatToParts(
      new Date(`${dataSuccessiva}T00:00:00.000Z`)
    )
    .find(
      (parte) => parte.type === "timeZoneName"
    )?.value;

  const match = nomeFuso?.match(
    /^GMT([+-])(\d{1,2})(?::(\d{2}))?$/
  );

  if (!match) {
    throw new Error(
      "Impossibile calcolare la scadenza."
    );
  }

  const offset =
    `${match[1]}${match[2].padStart(2, "0")}:` +
    `${match[3] ?? "00"}`;

  return new Date(
    `${dataSuccessiva}T00:00:00${offset}`
  ).toISOString();
}

async function completaPagamento(registro) {
  if (
    registro.origine !== "manuale" ||
    registro.status !== "pending" ||
    !registro.manual_operation_id ||
    !registro.manual_period_end ||
    !registro.data_scadenza_manuale
  ) {
    throw new Error(
      "Operazione di pagamento non valida."
    );
  }

  const { data: abbonamento, error: letturaError } =
    await supabaseAdmin
      .from("abbonamento")
      .select(`
        id,
        utente,
        origine,
        status,
        current_period_start,
        current_period_end,
        last_manual_operation_id
      `)
      .eq("utente", registro.utente)
      .maybeSingle();

  if (letturaError) throw letturaError;

  if (
    !abbonamento ||
    abbonamento.origine !== "manuale"
  ) {
    throw new Error(
      "Abbonamento manuale non trovato."
    );
  }

  const giaApplicato =
    abbonamento.last_manual_operation_id ===
      registro.manual_operation_id &&
    Date.parse(abbonamento.current_period_end) ===
      Date.parse(registro.manual_period_end);

  if (!giaApplicato) {
    const vecchiaFine = abbonamento.current_period_end;

    if (
      Date.parse(registro.manual_period_end) <=
      Date.now()
    ) {
      throw new Error(
        "La scadenza indicata non è più futura."
      );
    }

    if (
      vecchiaFine &&
      Date.parse(registro.manual_period_end) <=
        Date.parse(vecchiaFine)
    ) {
      throw new Error(
        "La nuova scadenza deve essere successiva a quella attuale."
      );
    }

    const dati = {
      status: "active",
      current_period_start:
        registro.manual_period_start,
      current_period_end:
        registro.manual_period_end,
      data_scadenza_manuale:
        registro.data_scadenza_manuale,
      last_manual_operation_id:
        registro.manual_operation_id,
      updated_at: new Date().toISOString(),
    };

    let query = supabaseAdmin
      .from("abbonamento")
      .update(dati)
      .eq("id", abbonamento.id)
      .eq("origine", "manuale");

    // Controlli per evitare di sovrascrivere una
    // modifica effettuata nel frattempo.
    query = vecchiaFine
      ? query.eq("current_period_end", vecchiaFine)
      : query.is("current_period_end", null);

    query = abbonamento.last_manual_operation_id
      ? query.eq(
          "last_manual_operation_id",
          abbonamento.last_manual_operation_id
        )
      : query.is(
          "last_manual_operation_id",
          null
        );

    const { data: modificato, error: modificaError } =
      await query
        .select("id")
        .maybeSingle();

    if (modificaError) throw modificaError;

    if (!modificato) {
      throw new Error(
        "L'abbonamento è cambiato: controlla i dati e riprova."
      );
    }
  }

  const { error: confermaError } =
    await supabaseAdmin
      .from("registro_abbonamento")
      .update({ status: "paid" })
      .eq("id", registro.id)
      .eq("status", "pending");

  if (confermaError) throw confermaError;
}

export async function registraPagamentoManuale(
  previousState,
  formData
) {
  try {
    await verificaOperatore();

    const abbonamentoId = String(
      formData.get("abbonamentoId") ?? ""
    );

    const operazioneId = String(
      formData.get("operazioneId") ?? ""
    );

    if (
      !UUID.test(abbonamentoId) ||
      !UUID.test(operazioneId)
    ) {
      throw new Error(
        "Identificativo dell'operazione non valido."
      );
    }

    const { data: abbonamento, error: abbError } =
      await supabaseAdmin
        .from("abbonamento")
        .select(`
          id,
          utente,
          id_piano_abbonamento,
          origine,
          status,
          current_period_start,
          current_period_end
        `)
        .eq("id", abbonamentoId)
        .maybeSingle();

    if (
      abbError ||
      !abbonamento ||
      abbonamento.origine !== "manuale"
    ) {
      throw new Error(
        "Abbonamento manuale non trovato."
      );
    }

    let { data: registro, error: ricercaError } =
      await supabaseAdmin
        .from("registro_abbonamento")
        .select("*")
        .eq("manual_operation_id", operazioneId)
        .maybeSingle();

    if (ricercaError) throw ricercaError;

    if (registro) {
      if (
        registro.utente !== abbonamento.utente ||
        registro.origine !== "manuale"
      ) {
        throw new Error(
          "ID operazione già utilizzato per un altro cliente."
        );
      }

      if (registro.status === "paid") {
        return {
          success: true,
          message:
            "Pagamento già registrato. Nessun duplicato creato.",
        };
      }
    } else {
      const importoTesto = String(
        formData.get("importo") ?? ""
      )
        .trim()
        .replace(",", ".");

      const dataPagamento = String(
        formData.get("dataPagamento") ?? ""
      );

      const dataScadenza = String(
        formData.get("dataScadenza") ?? ""
      );

      const metodoPagamento = String(
        formData.get("metodoPagamento") ?? ""
      );

      const riferimento =
        String(
          formData.get("riferimentoPagamento") ??
            ""
        ).trim() || null;

      if (
        !/^\d+(\.\d{1,2})?$/.test(
          importoTesto
        ) ||
        Number(importoTesto) <= 0
      ) {
        throw new Error(
          "Inserisci un importo maggiore di zero, con massimo due decimali."
        );
      }

      if (!dataValida(dataPagamento)) {
        throw new Error(
          "Data del pagamento non valida."
        );
      }

      if (
        ![
          "bonifico",
          "contanti",
          "pos",
          "altro",
        ].includes(metodoPagamento)
      ) {
        throw new Error(
          "Metodo di pagamento non valido."
        );
      }

      const fine = fineDelGiornoInItalia(
        dataScadenza
      );

      if (Date.parse(fine) <= Date.now()) {
        throw new Error(
          "La scadenza deve essere futura."
        );
      }

      if (
        abbonamento.current_period_end &&
        Date.parse(fine) <=
          Date.parse(
            abbonamento.current_period_end
          )
      ) {
        throw new Error(
          "La nuova scadenza deve essere successiva a quella corrente."
        );
      }

      const ora = new Date().toISOString();

      const conservaInizio =
        abbonamento.status === "active" &&
        abbonamento.current_period_start &&
        abbonamento.current_period_end &&
        Date.parse(
          abbonamento.current_period_end
        ) > Date.now();

      const inizio = conservaInizio
        ? abbonamento.current_period_start
        : ora;

      const { data: piano, error: pianoError } =
        await supabaseAdmin
          .from("piano_abbonamento")
          .select("durata")
          .eq(
            "id",
            abbonamento.id_piano_abbonamento
          )
          .maybeSingle();

      if (pianoError || !piano) {
        throw new Error(
          "Piano dell'abbonamento non trovato."
        );
      }

      const inserimento =
        await supabaseAdmin
          .from("registro_abbonamento")
          .insert({
            utente: abbonamento.utente,
            id_piano_abbonamento:
              abbonamento.id_piano_abbonamento,
            origine: "manuale",
            manual_operation_id: operazioneId,
            manual_period_start: inizio,
            manual_period_end: fine,
            data_scadenza_manuale:
              dataScadenza,
            data_pagamento: dataPagamento,
            durata: piano.durata,
            costo: importoTesto,
            metodo_pagamento:
              metodoPagamento,
            riferimento_pagamento:
              riferimento,
            status: "pending",
          })
          .select("*")
          .single();

      if (inserimento.error) {
        throw inserimento.error;
      }

      registro = inserimento.data;
    }

    await completaPagamento(registro);
    revalidatePath("/manager/abbonamenti");
    revalidatePath(
      "/account/utente/abbonamento"
    );

    return {
      success: true,
      message:
        "Pagamento registrato e scadenza aggiornata.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.message ||
        "Errore durante la registrazione del pagamento.",
    };
  }
}