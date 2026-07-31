"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const eliminazioniConsentite = {
  menu: {
    idFields: ["id"],
    imageFields: ["immagine"],
    buckets: ["menu"],
  },

  horeca: {
    idFields: ["id"],
    imageFields: ["logo", "cover"],
    buckets: ["horeca"],
  },
};

function getStoragePath(imageValue, bucket) {
  if (!imageValue) return null;

  /*
   * Se nel database è salvato direttamente il percorso:
   * id-horeca/nome-file.webp
   */
  if (!imageValue.startsWith("http")) {
    return imageValue.replace(/^\/+/, "");
  }

  /*
   * Se nel database è salvato l'URL pubblico completo:
   * https://...supabase.co/storage/v1/object/public/menu/cartella/file.webp
   */
  const marker = `/storage/v1/object/public/${bucket}/`;
  const posizione = imageValue.indexOf(marker);

  if (posizione === -1) {
    return null;
  }

  return decodeURIComponent(
    imageValue.substring(posizione + marker.length)
  );
}

export async function deleteRecord({
  table,
  id,
  idField = "id",
  bucket,
  imageField,
  revalidate,
}) {
  try {
    if (!table || !id) {
      return {
        success: false,
        message: "Tabella o ID mancanti",
      };
    }

    const configurazione = eliminazioniConsentite[table];

    if (!configurazione) {
      return {
        success: false,
        message: "Tabella non consentita",
      };
    }

    if (!configurazione.idFields.includes(idField)) {
      return {
        success: false,
        message: "Chiave primaria non consentita",
      };
    }

    if (
      imageField &&
      !configurazione.imageFields.includes(imageField)
    ) {
      return {
        success: false,
        message: "Campo immagine non consentito",
      };
    }

    if (
      bucket &&
      !configurazione.buckets.includes(bucket)
    ) {
      return {
        success: false,
        message: "Bucket non consentito",
      };
    }

    const db = await createClient();

    let imagePath = null;

    /*
     * Recupera il valore dell'immagine direttamente dal database,
     * evitando di fidarsi di un percorso passato dal client.
     */
    if (bucket && imageField) {
      const { data: record, error: recordError } = await db
        .from(table)
        .select(imageField)
        .eq(idField, id)
        .maybeSingle();

      if (recordError) {
        console.error(
          "Errore recupero record:",
          recordError
        );

        return {
          success: false,
          message: recordError.message,
        };
      }

      if (!record) {
        return {
          success: false,
          message: "Record non trovato",
        };
      }

      imagePath = getStoragePath(
        record[imageField],
        bucket
      );
    }

    /*
     * Elimina prima il record.
     * In questo modo, se il record non può essere eliminato,
     * l'immagine non viene rimossa.
     */
    const { error: deleteError } = await db
      .from(table)
      .delete()
      .eq(idField, id);

    if (deleteError) {
      console.error(
        "Errore eliminazione record:",
        deleteError
      );

      return {
        success: false,
        message: deleteError.message,
      };
    }

    /*
     * Elimina l'immagine soltanto se esiste.
     */
    let imageDeleted = true;
    let imageErrorMessage = null;

    if (bucket && imagePath) {
      const { error: storageError } = await db.storage
        .from(bucket)
        .remove([imagePath]);

      if (storageError) {
        console.error(
          "Record eliminato, ma errore eliminazione immagine:",
          storageError
        );

        imageDeleted = false;
        imageErrorMessage = storageError.message;
      }
    }

    if (revalidate) {
      revalidatePath(revalidate);
    }

    return {
      success: true,
      id,
      imageDeleted,
      imageErrorMessage,
      message: imageDeleted
        ? "Record e immagine eliminati"
        : "Record eliminato, ma non è stato possibile eliminare l'immagine",
    };
  } catch (error) {
    console.error("Errore deleteRecord:", error);

    return {
      success: false,
      message:
        error?.message ||
        "Errore durante l'eliminazione",
    };
  }
}