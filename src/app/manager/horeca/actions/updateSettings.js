"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const BUCKET_NAME = "horeca";

export async function updateSettingsHoreca(formData) {
  const idHoreca = formData.get("id_horeca");

  if (!idHoreca) {
    return {
      success: false,
      message: "ID Horeca mancante.",
    };
  }

  const supabase = await createClient();

  /*
   * Recuperiamo prima la configurazione attuale.
   */
  const {
    data: configurazioneAttuale,
    error: configurazioneError,
  } = await supabase
    .from("horeca_configurazione")
    .select("settings")
    .eq("id_horeca", idHoreca)
    .maybeSingle();

  if (configurazioneError) {
    console.error(
      "Errore recupero configurazione:",
      configurazioneError
    );

    return {
      success: false,
      message:
        "Errore durante il recupero della configurazione.",
    };
  }

  const settingsAttuali =
    configurazioneAttuale?.settings ?? {};

  /*
   * Manteniamo inizialmente tutti i valori già presenti.
   */
  let logoUrl = settingsAttuali.logo ?? null;
  let coverUrl = settingsAttuali.cover ?? null;

  const logoFile = formData.get("logo");
  const coverFile = formData.get("cover");

  try {
    /*
     * Il logo viene modificato solamente
     * se è stato selezionato un nuovo file.
     */
    if (
      logoFile instanceof File &&
      logoFile.size > 0
    ) {
      logoUrl = await uploadHorecaImage({
        supabase,
        file: logoFile,
        idHoreca,
        type: "logo",
      });
    }

    /*
     * La cover viene modificata solamente
     * se è stato selezionato un nuovo file.
     */
    if (
      coverFile instanceof File &&
      coverFile.size > 0
    ) {
      coverUrl = await uploadHorecaImage({
        supabase,
        file: coverFile,
        idHoreca,
        type: "cover",
      });
    }
  } catch (error) {
    console.error("Errore upload immagini:", error);

    return {
      success: false,
      message:
        error.message ||
        "Errore durante il caricamento delle immagini.",
    };
  }

  /*
   * Partiamo dal JSON esistente e sovrascriviamo
   * solamente le chiavi gestite dal form.
   */
  const settingsAggiornati = {
    ...settingsAttuali,

    colore: getTextValue(
      formData,
      "colore",
      settingsAttuali.colore
    ),

    coloreTestoHeader: getTextValue(
      formData,
      "coloreTestoHeader",
      settingsAttuali.coloreTestoHeader
    ),

    logo: logoUrl,
    cover: coverUrl,

    tiktok: getNullableTextValue(
      formData,
      "tiktok",
      settingsAttuali.tiktok
    ),

    instagram: getNullableTextValue(
      formData,
      "instagram",
      settingsAttuali.instagram
    ),

    facebook: getNullableTextValue(
      formData,
      "facebook",
      settingsAttuali.facebook
    ),

    email: getNullableTextValue(
      formData,
      "email",
      settingsAttuali.email
    ),

    whatsapp: getNullableTextValue(
      formData,
      "whatsapp",
      settingsAttuali.whatsapp
    ),

    maps: getBooleanValue(
      formData,
      "maps",
      settingsAttuali.maps
    ),

    prenotazioni: getBooleanValue(
      formData,
      "prenotazioni",
      settingsAttuali.prenotazioni
    ),
  };

  const { error: updateError } = await supabase
    .from("horeca_configurazione")
    .update({
      settings: settingsAggiornati,
    })
    .eq("id_horeca", idHoreca);

  if (updateError) {
    console.error(
      "Errore aggiornamento configurazione:",
      updateError
    );

    return {
      success: false,
      message:
        "Errore durante il salvataggio della configurazione.",
    };
  }

  revalidatePath(
    `/manager/horeca/settings/${idHoreca}`
  );

  return {
    success: true,
    message: "Configurazione aggiornata correttamente.",
  };
}

function getTextValue(formData, key, fallback = "") {
  if (!formData.has(key)) {
    return fallback;
  }

  const value = formData.get(key);

  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim();
}

function getNullableTextValue(
  formData,
  key,
  fallback = null
) {
  if (!formData.has(key)) {
    return fallback;
  }

  const value = formData.get(key);

  if (typeof value !== "string") {
    return fallback;
  }

  const normalizedValue = value.trim();

  return normalizedValue || null;
}

function getBooleanValue(
  formData,
  key,
  fallback = false
) {
  if (!formData.has(key)) {
    return fallback;
  }

  return formData.get(key) === "true";
}

async function uploadHorecaImage({
  supabase,
  file,
  idHoreca,
  type,
}) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Formato immagine non valido. Usa JPG, PNG o WEBP."
    );
  }

  const maxSize = 3 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      "L'immagine non può superare i 3 MB."
    );
  }

  const extension =
    file.name.split(".").pop()?.toLowerCase() ||
    "webp";

  const filePath = `${idHoreca}/${type}-${Date.now()}.${extension}`;

  const { error: uploadError } =
    await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}