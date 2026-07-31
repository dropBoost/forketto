"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const allergeniKeys = [
  "cereali",
  "crostacei",
  "uova",
  "pesce",
  "arachidi",
  "soia",
  "latte",
  "frutta_guscio",
  "sedano",
  "senape",
  "semi_sesamo",
  "anidride_solforosa_solfiti",
  "lupini",
  "molluschi",
];

function getAllergeni(formData) {
  return allergeniKeys.reduce(
    (result, allergene) => {
      result[allergene] =
        formData.get(
          `allergene_${allergene}`
        ) === "true";

      return result;
    },
    {}
  );
}

function getExtension(file) {
  const extension = file.name
    ?.split(".")
    .pop()
    ?.toLowerCase();

  if (extension) {
    return extension;
  }

  const mimeExtensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  return mimeExtensions[file.type] || "jpg";
}

function getStoragePathFromPublicUrl(url) {
  if (!url) return null;

  const marker =
    "/storage/v1/object/public/menu/";

  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(
    url.substring(markerIndex + marker.length)
  );
}

export async function updateMenuAction(
  prevState,
  formData
) {
  const db = await createClient();

  const file = formData.get("immagine");

  const values = {
    id: formData.get("id")?.toString() || "",
    id_horeca:
      formData.get("id_horeca")?.toString() || "",
    id_categoria:
      formData.get("id_categoria")?.toString() || "",
    nome: formData.get("nome")?.toString() || "",
    descrizione:
      formData.get("descrizione")?.toString() || "",
    ingredienti:
      formData.get("ingredienti")?.toString() || "",
    prezzo_listino:
      formData.get("prezzo_listino")?.toString() ||
      "",
    prezzo_promo:
      formData.get("prezzo_promo")?.toString() ||
      "",
    immagine_attuale:
      formData
        .get("immagine_attuale")
        ?.toString() || "",
    rimuovi_immagine:
      formData.get("rimuovi_immagine") === "true",
    vetrina:
      formData.get("vetrina") === "true",
    attivo:
      formData.get("attivo") === "true",
  };

  const errors = {};

  if (!values.id) {
    errors.id = "Record non valido.";
  }

  if (!values.id_horeca) {
    errors.id_horeca =
      "Struttura Horeca non valida.";
  }

  if (!values.nome.trim()) {
    errors.nome = "Inserisci il nome.";
  }

  if (!values.id_categoria) {
    errors.id_categoria =
      "Seleziona una categoria.";
  }

  if (!values.prezzo_listino) {
    errors.prezzo_listino =
      "Inserisci il prezzo di listino.";
  }

  const prezzoListino = Number(
    values.prezzo_listino
  );

  const prezzoPromo = values.prezzo_promo
    ? Number(values.prezzo_promo)
    : null;

  if (
    values.prezzo_listino &&
    (!Number.isFinite(prezzoListino) ||
      prezzoListino < 0)
  ) {
    errors.prezzo_listino =
      "Inserisci un prezzo valido.";
  }

  if (
    values.prezzo_promo &&
    (!Number.isFinite(prezzoPromo) ||
      prezzoPromo < 0)
  ) {
    errors.prezzo_promo =
      "Inserisci un prezzo promozionale valido.";
  }

  if (
    prezzoPromo !== null &&
    prezzoPromo >= prezzoListino
  ) {
    errors.prezzo_promo =
      "Il prezzo promozionale deve essere inferiore al prezzo di listino.";
  }

  const hasNewImage =
    file instanceof File &&
    file.size > 0;

  if (hasNewImage) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      errors.immagine =
        "Formato immagine non valido.";
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      errors.immagine =
        "L'immagine non può superare i 5 MB.";
    }
  }

  if (Object.keys(errors).length) {
    return {
      success: false,
      message: "Controlla i campi inseriti.",
      errors,
    };
  }

  let nuovaImmagineUrl =
    values.rimuovi_immagine
      ? null
      : values.immagine_attuale || null;

  let nuovoPath = null;

  const vecchioPath =
    getStoragePathFromPublicUrl(
      values.immagine_attuale
    );

  if (hasNewImage) {
    const extension = getExtension(file);

    const fileName =
      `${crypto.randomUUID()}.${extension}`;

    nuovoPath =
      `${values.id_horeca}/${fileName}`;

    const { error: uploadError } =
      await db.storage
        .from("menu")
        .upload(nuovoPath, file, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

    if (uploadError) {
      return {
        success: false,
        message:
          "Errore durante il caricamento dell'immagine.",
        errors: {
          immagine: uploadError.message,
        },
      };
    }

    const { data } = db.storage
      .from("menu")
      .getPublicUrl(nuovoPath);

    nuovaImmagineUrl = data.publicUrl;
  }

  const allergeni = getAllergeni(formData);

  const { error: updateError } = await db
    .from("menu")
    .update({
      id_categoria: values.id_categoria,
      nome: values.nome.trim(),
      descrizione:
        values.descrizione.trim() || null,
      ingredienti:
        values.ingredienti.trim() || null,
      allergeni,
      prezzo_listino: prezzoListino,
      prezzo_promo: prezzoPromo,
      immagine: nuovaImmagineUrl,
      vetrina: values.vetrina,
      attivo: values.attivo,
    })
    .eq("id", values.id)
    .eq("id_horeca", values.id_horeca);

  if (updateError) {
    if (nuovoPath) {
      await db.storage
        .from("menu")
        .remove([nuovoPath]);
    }

    return {
      success: false,
      message: `Errore durante l'aggiornamento: ${updateError.message}`,
      errors: {},
    };
  }

  if (
    vecchioPath &&
    (
      hasNewImage ||
      values.rimuovi_immagine
    )
  ) {
    await db.storage
      .from("menu")
      .remove([vecchioPath]);
  }

  revalidatePath("/menu");

  return {
    success: true,
    message: "Elemento aggiornato correttamente.",
    errors: {},
  };
}