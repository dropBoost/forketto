// src/actions/switchBoolean.js

"use server";

import { createClient } from "@/utils/supabase/server";

export async function switchBoolean({
  table,
  id,
  field,
  value,
  idField = "id",
}) {
  try {
    if (!table || !id || !field) {
      return {
        success: false,
        message: "Parametri mancanti",
      };
    }

    if (typeof value !== "boolean") {
      return {
        success: false,
        message: "Il valore deve essere booleano",
      };
    }

    const db = await createClient();

    const nuovoValore = !value;

    const { data, error } = await db
      .from(table)
      .update({
        [field]: nuovoValore,
      })
      .eq(idField, id)
      .select()
      .single();

    if (error) {
      console.error("Errore aggiornamento booleano:", error);

      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      value: nuovoValore,
      data,
    };
  } catch (error) {
    console.error("Errore switchBoolean:", error);

    return {
      success: false,
      message:
        error?.message ||
        "Errore durante l'aggiornamento",
    };
  }
}