"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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

export async function createCategoriaAction(
  prevState,
  formData
) {
  const db = await createClient();

  const immagine = formData.get("immagine");

  const values = {
    id_horeca: formData.get("id_horeca")?.toString() || "",
    id_supercategoria: formData.get("id_supercategoria")?.toString() || "",
    alias: formData.get("alias")?.toString() || "",
    descrizione: formData.get("descrizione")?.toString() || "",
    attivo: formData.get("attivo") === "true",
  };

  const errors = {};

  if (!values.id_horeca) {
    errors.id_horeca = "Horeca non valido";
  }

  if (!values.id_supercategoria) {
    errors.id_supercategoria =
      "Seleziona una supercategoria";
  }

  if (!values.alias.trim()) {
    errors.alias =
      "Inserisci il nome della categoria";
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

  const aliasNormalizzato = values.alias
    .trim()
    .toLocaleLowerCase("it-IT");

  const {
    data: categoriaEsistente,
    error: checkCategoriaError,
  } = await db
    .from("menu_categoria_horeca")
    .select("id")
    .eq("id_horeca", values.id_horeca)
    .ilike("alias", aliasNormalizzato)
    .limit(1);

  if (checkCategoriaError) {
    console.error(
      "Errore controllo categoria esistente:",
      checkCategoriaError
    );

    return {
      success: false,
      message:
        "Non è stato possibile verificare la categoria.",
      errors: {},
      values: {
        ...values,
        alias: aliasNormalizzato,
      },
    };
  }

  if (categoriaEsistente?.length > 0) {
    return {
      success: false,
      message: "La categoria è già presente.",
      errors: {
        alias:
          "Hai già creato una categoria con questo nome.",
      },
      values: {
        ...values,
        alias: aliasNormalizzato,
      },
    };
  }

  let imagePath = null;
  let imageUrl = null;

  if (hasImage) {
    const extension = getFileExtension(immagine);
    const fileName = `${values.id_supercategoria}-${values.alias}-${crypto.randomUUID()}.${extension}`;

    imagePath = `${values.id_horeca}/cat_cover/${fileName}`;

    const { error: uploadError } = await db.storage
      .from("horeca")
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
      .from("horeca")
      .getPublicUrl(imagePath);

    imageUrl = publicUrlData.publicUrl;
  }

  const { error: insertError } = await db
    .from("menu_categoria_horeca")
    .insert({
      id_horeca: values.id_horeca,
      id_supercategoria: values.id_supercategoria,
      alias: aliasNormalizzato,
      descrizione: values.descrizione.trim() || null,
      cover: imageUrl,
      attiva: values.attivo,
    });

  if (insertError) {
    console.error(
      "Errore creazione categoria:",
      insertError
    );

    if (imagePath) {
      await db.storage
        .from("horeca")
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
    message: "Categoria creata correttamente.",
    errors: {},
    values: {},
  };
}