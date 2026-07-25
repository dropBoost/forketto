import { z } from "zod";

export const horecaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Il nome deve contenere almeno 2 caratteri")
    .max(100, "Il nome non può superare 100 caratteri"),

  alias: z
    .string()
    .trim()
    .min(2, "L'alias deve contenere almeno 2 caratteri")
    .max(30, "L'alias non può superare 100 caratteri")
    .regex(
      /^[a-z0-9]+([_-]?[a-z0-9]+)*$/,
      "L'alias può contenere solo lettere minuscole, numeri, trattini e underscore."
    ),

  provincia: z
    .string()
    .trim()
    .min(2, "La provincia deve contenere minimo 2 caratteri")
    .max(2, "La provincia non può superare 2 caratteri"),

  citta: z
    .string()
    .trim()
    .min(2, "Inserisci una città valida")
    .max(100, "La città non può superare 100 caratteri"),

  cap: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Il CAP deve contenere 5 cifre"),

  indirizzo: z
    .string()
    .trim()
    .min(3, "Inserisci un indirizzo valido")
    .max(150, "L'indirizzo non può superare 150 caratteri"),

  civico: z
    .string()
    .trim()
    .min(1, "Inserisci il numero civico")
    .max(10, "Il numero civico non può superare 20 caratteri"),

  attivo: z.boolean(),
});