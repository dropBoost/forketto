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

function getAllergeniFromFormData(formData) {
  return allergeniKeys.reduce((allergeni, key) => {
    allergeni[key] =
      formData.get(`allergene_${key}`) === "true";

    return allergeni;
  }, {});
}

function getFileExtension(file) {
  const extension = file.name
    ?.split(".")
    .pop()
    ?.toLowerCase();

  if (extension) {
    return extension;
  }

  const extensionByMimeType = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };

  return extensionByMimeType[file.type] || "jpg";
}

export async function createMenuActionQuick(
  prevState,
  formData
) {
  const db = await createClient();

  const immagine = formData.get("immagine");
  const allergeni = getAllergeniFromFormData(formData);

  const values = {
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
      formData.get("prezzo_listino")?.toString() || "",
    prezzo_promo:
      formData.get("prezzo_promo")?.toString() || "",
    vetrina: formData.get("vetrina") === "true",
    attivo: formData.get("attivo") === "true",
    allergeni,
  };

  const errors = {};

  if (!values.id_horeca) {
    errors.id_horeca = "Horeca non valido.";
  }

  if (!values.id_categoria) {
    errors.id_categoria =
      "Seleziona una categoria.";
  }

  if (!values.nome.trim()) {
    errors.nome =
      "Inserisci il nome del piatto.";
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
    Number.isFinite(prezzoPromo) &&
    Number.isFinite(prezzoListino) &&
    prezzoPromo >= prezzoListino
  ) {
    errors.prezzo_promo =
      "Il prezzo promozionale deve essere inferiore al prezzo di listino.";
  }

  const hasImage =
    immagine instanceof File &&
    immagine.size > 0;

  if (hasImage) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(immagine.type)) {
      errors.immagine =
        "Formato non valido. Utilizza JPG, PNG o WEBP.";
    }

    const maxSize = 5 * 1024 * 1024;

    if (immagine.size > maxSize) {
      errors.immagine =
        "L'immagine non può superare i 5 MB.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Controlla i campi inseriti.",
      errors,
      values,
    };
  }

  let imagePath = null;
  let imageUrl = null;

  if (hasImage) {
    const extension = getFileExtension(immagine);
    const fileName = `${crypto.randomUUID()}.${extension}`;

    imagePath = `${values.id_horeca}/${fileName}`;

    const { error: uploadError } = await db.storage
      .from("menu")
      .upload(imagePath, immagine, {
        contentType: immagine.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(
        "Errore upload immagine:",
        uploadError
      );

      return {
        success: false,
        message:
          "Errore durante il caricamento dell'immagine.",
        errors: {
          immagine: uploadError.message,
        },
        values,
      };
    }

    const { data: publicUrlData } = db.storage
      .from("menu")
      .getPublicUrl(imagePath);

    imageUrl = publicUrlData.publicUrl;
  }

  const { error: insertError } = await db
    .from("menu")
    .insert({
      id_horeca: values.id_horeca,
      id_categoria: values.id_categoria,
      nome: values.nome.trim(),
      descrizione:
        values.descrizione.trim() || null,
      ingredienti:
        values.ingredienti.trim() || null,
      allergeni: values.allergeni,
      prezzo_listino: prezzoListino,
      prezzo_promo: prezzoPromo,
      immagine: imageUrl,
      vetrina: values.vetrina,
      attivo: values.attivo,
    });

  if (insertError) {
    console.error(
      "Errore creazione menu:",
      insertError
    );

    // Se l'inserimento fallisce, elimina l'immagine
    // appena caricata per evitare file inutilizzati.
    if (imagePath) {
      await db.storage
        .from("menu")
        .remove([imagePath]);
    }

    return {
      success: false,
      message: `Errore durante il salvataggio: ${insertError.message}`,
      errors: {},
      values,
    };
  }

  revalidatePath("/menu");

  return {
    success: true,
    message: "Piatto creato correttamente.",
    errors: {},
    values: {},
  };
}