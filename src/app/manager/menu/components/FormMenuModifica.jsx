"use client"

import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react"
import { ImagePlus, Trash2 } from "lucide-react"
import { updateMenuAction } from "../actions/updateMenuAction"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

const allergeniDisponibili = [
  {
    key: "cereali",
    label: "Cereali contenenti glutine",
  },
  {
    key: "crostacei",
    label: "Crostacei",
  },
  {
    key: "uova",
    label: "Uova",
  },
  {
    key: "pesce",
    label: "Pesce",
  },
  {
    key: "arachidi",
    label: "Arachidi",
  },
  {
    key: "soia",
    label: "Soia",
  },
  {
    key: "latte",
    label: "Latte",
  },
  {
    key: "frutta_guscio",
    label: "Frutta a guscio",
  },
  {
    key: "sedano",
    label: "Sedano",
  },
  {
    key: "senape",
    label: "Senape",
  },
  {
    key: "semi_sesamo",
    label: "Semi di sesamo",
  },
  {
    key: "anidride_solforosa_solfiti",
    label: "Anidride solforosa e solfiti",
  },
  {
    key: "lupini",
    label: "Lupini",
  },
  {
    key: "molluschi",
    label: "Molluschi",
  },
]

function creaIngredientiIniziali(ingredientiSalvati) {
  let ingredienti = ingredientiSalvati

  /*
   * Compatibilità con eventuali vecchi valori
   * salvati come stringa.
   */
  if (typeof ingredientiSalvati === "string") {
    try {
      ingredienti = JSON.parse(ingredientiSalvati)
    } catch {
      ingredienti = ingredientiSalvati
        .split(",")
        .map((nome) => ({
          nome: nome.trim(),
          status: true,
        }))
        .filter((ingrediente) => ingrediente.nome)
    }
  }

  const ingredientiValidi = Array.isArray(ingredienti)
    ? ingredienti
        .filter(
          (ingrediente) =>
            ingrediente &&
            typeof ingrediente.nome === "string" &&
            ingrediente.nome.trim()
        )
        .map((ingrediente, index) => ({
          id: index,
          nome: ingrediente.nome,
          status:
            typeof ingrediente.status === "boolean"
              ? ingrediente.status
              : true,
        }))
    : []

  /*
   * Aggiunge sempre un campo vuoto finale,
   * pronto per un nuovo ingrediente.
   */
  return [
    ...ingredientiValidi,
    {
      id: ingredientiValidi.length,
      nome: "",
      status: true,
    },
  ]
}

export default function FormModificaMenu({
  elemento,
  categorie = [],
  onSuccess,
}) {
  const fileInputRef = useRef(null)

  const [state, formAction, pending] = useActionState(
    updateMenuAction,
    initialState
  )

  const [ingredienti, setIngredienti] = useState(() =>
    creaIngredientiIniziali(elemento.ingredienti)
  )

  const prossimoIngredienteId = useRef(
    ingredienti.length
  )

  const [previewImmagine, setPreviewImmagine] =
    useState(elemento.immagine || null)

  const [nuovaImmagine, setNuovaImmagine] =
    useState(false)

  const [rimuoviImmagine, setRimuoviImmagine] =
    useState(false)

  useEffect(() => {
    if (state.success) {
      onSuccess?.()
    }
  }, [state.success, onSuccess])

  useEffect(() => {
    return () => {
      if (
        nuovaImmagine &&
        previewImmagine?.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previewImmagine)
      }
    }
  }, [previewImmagine, nuovaImmagine])

  function handleImageChange(event) {
    const file = event.target.files?.[0]

    if (!file) return

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ]

    if (!allowedTypes.includes(file.type)) {
      event.target.value = ""
      return
    }

    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      event.target.value = ""
      return
    }

    if (
      nuovaImmagine &&
      previewImmagine?.startsWith("blob:")
    ) {
      URL.revokeObjectURL(previewImmagine)
    }

    setPreviewImmagine(URL.createObjectURL(file))
    setNuovaImmagine(true)
    setRimuoviImmagine(false)
  }

  function removeImage() {
    if (
      nuovaImmagine &&
      previewImmagine?.startsWith("blob:")
    ) {
      URL.revokeObjectURL(previewImmagine)
    }

    setPreviewImmagine(null)
    setNuovaImmagine(false)
    setRimuoviImmagine(true)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function modificaIngrediente(id, nome) {
    setIngredienti((ingredientiCorrenti) => {
      const ingredientiAggiornati =
        ingredientiCorrenti.map((ingrediente) =>
          ingrediente.id === id
            ? {
                ...ingrediente,
                nome,
              }
            : ingrediente
        )

      const ultimoIngrediente =
        ingredientiAggiornati[
          ingredientiAggiornati.length - 1
        ]

      /*
       * Quando viene compilato l’ultimo campo,
       * ne aggiunge automaticamente uno nuovo.
       */
      if (ultimoIngrediente?.nome.trim()) {
        ingredientiAggiornati.push({
          id: prossimoIngredienteId.current++,
          nome: "",
          status: true,
        })
      }

      return ingredientiAggiornati
    })
  }

  function rimuoviIngrediente(id) {
    setIngredienti((ingredientiCorrenti) => {
      const ingredientiAggiornati =
        ingredientiCorrenti.filter(
          (ingrediente) => ingrediente.id !== id
        )

      /*
       * Mantiene sempre almeno un campo vuoto
       * alla fine della lista.
       */
      if (
        ingredientiAggiornati.length === 0 ||
        ingredientiAggiornati.at(-1)?.nome.trim()
      ) {
        ingredientiAggiornati.push({
          id: prossimoIngredienteId.current++,
          nome: "",
          status: true,
        })
      }

      return ingredientiAggiornati
    })
  }

  /*
   * Rimuove i campi vuoti e la proprietà id,
   * che serve solamente al rendering React.
   */
  const ingredientiDaSalvare = ingredienti
    .filter((ingrediente) => ingrediente.nome.trim())
    .map((ingrediente) => ({
      nome: ingrediente.nome.trim(),
      status: true,
    }))

  return (
    <form
      action={formAction}
      className="space-y-6"
    >
      <input
        type="hidden"
        name="id"
        value={elemento.id}
      />

      <input
        type="hidden"
        name="id_horeca"
        value={elemento.id_horeca}
      />

      <input
        type="hidden"
        name="immagine_attuale"
        value={elemento.immagine || ""}
      />

      <input
        type="hidden"
        name="rimuovi_immagine"
        value={rimuoviImmagine ? "true" : "false"}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`nome-${elemento.id}`}>
            Nome
          </Label>

          <Input
            id={`nome-${elemento.id}`}
            name="nome"
            defaultValue={elemento.nome || ""}
            placeholder="Nome del piatto"
          />

          {state.errors?.nome && (
            <p className="text-sm text-destructive">
              {state.errors.nome}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`categoria-${elemento.id}`}
          >
            Categoria
          </Label>

          <Select
            name="id_categoria"
            defaultValue={
              elemento.id_categoria
                ? String(elemento.id_categoria)
                : undefined
            }
          >
            <SelectTrigger
              id={`categoria-${elemento.id}`}
            >
              <SelectValue placeholder="Seleziona categoria" />
            </SelectTrigger>

            <SelectContent>
              {categorie.map((categoria) => (
                <SelectItem
                  key={categoria.id}
                  value={String(categoria.id)}
                >
                  {categoria.alias}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {state.errors?.id_categoria && (
            <p className="text-sm text-destructive">
              {state.errors.id_categoria}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor={`descrizione-${elemento.id}`}
        >
          Descrizione
        </Label>

        <Textarea
          id={`descrizione-${elemento.id}`}
          name="descrizione"
          defaultValue={elemento.descrizione || ""}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Ingredienti</Label>

        <input
          type="hidden"
          name="ingredienti"
          value={JSON.stringify(
            ingredientiDaSalvare
          )}
          readOnly
        />

        <div className="space-y-3 rounded-lg border p-4">
          {ingredienti.map((ingrediente, index) => {
            const compilato =
              ingrediente.nome.trim() !== ""

            return (
              <div
                key={ingrediente.id}
                className="flex items-center gap-3"
              >
                <Input
                  id={`ingrediente-${elemento.id}-${ingrediente.id}`}
                  value={ingrediente.nome}
                  onChange={(event) =>
                    modificaIngrediente(
                      ingrediente.id,
                      event.target.value
                    )
                  }
                  placeholder={
                    index === 0
                      ? "Pomodoro"
                      : "Aggiungi un altro ingrediente"
                  }
                  autoComplete="off"
                />

                {compilato && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      rimuoviIngrediente(ingrediente.id)
                    }
                    aria-label={`Rimuovi ${ingrediente.nome}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-sm text-muted-foreground">
          Inserisci un ingrediente per far comparire
          automaticamente il campo successivo.
        </p>

        {state.errors?.ingredienti && (
          <p className="text-sm text-destructive">
            {state.errors.ingredienti}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <Label>Allergeni</Label>

          <p className="mt-1 text-sm text-muted-foreground">
            Seleziona gli allergeni presenti.
          </p>
        </div>

        <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
          {allergeniDisponibili.map(
            (allergene) => (
              <div
                key={allergene.key}
                className="flex items-center gap-3"
              >
                <Checkbox
                  id={`${elemento.id}-${allergene.key}`}
                  name={`allergene_${allergene.key}`}
                  value="true"
                  defaultChecked={
                    elemento.allergeni?.[
                      allergene.key
                    ] === true
                  }
                />

                <Label
                  htmlFor={`${elemento.id}-${allergene.key}`}
                  className="cursor-pointer font-normal"
                >
                  {allergene.label}
                </Label>
              </div>
            )
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor={`prezzo-listino-${elemento.id}`}
          >
            Prezzo di listino
          </Label>

          <Input
            id={`prezzo-listino-${elemento.id}`}
            name="prezzo_listino"
            type="number"
            min="0"
            step="0.01"
            defaultValue={
              elemento.prezzo_listino ?? ""
            }
          />

          {state.errors?.prezzo_listino && (
            <p className="text-sm text-destructive">
              {state.errors.prezzo_listino}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`prezzo-promo-${elemento.id}`}
          >
            Prezzo promozionale
          </Label>

          <Input
            id={`prezzo-promo-${elemento.id}`}
            name="prezzo_promo"
            type="number"
            min="0"
            step="0.01"
            defaultValue={
              elemento.prezzo_promo ?? ""
            }
          />

          {state.errors?.prezzo_promo && (
            <p className="text-sm text-destructive">
              {state.errors.prezzo_promo}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Immagine</Label>

        {previewImmagine ? (
          <div className="overflow-hidden rounded-lg border">
            <div className="aspect-video bg-muted">
              <img
                src={previewImmagine}
                alt="Anteprima piatto"
                className="size-full object-cover"
              />
            </div>

            <div className="flex flex-wrap gap-2 p-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                <ImagePlus className="size-4" />
                Sostituisci
              </Button>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeImage}
              >
                <Trash2 className="size-4" />
                Rimuovi
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 transition-colors hover:bg-muted/50"
          >
            <ImagePlus className="size-7 text-muted-foreground" />

            <span className="text-sm font-medium">
              Seleziona un'immagine
            </span>

            <span className="text-xs text-muted-foreground">
              JPG, PNG o WEBP
            </span>
          </button>
        )}

        <Input
          ref={fileInputRef}
          name="immagine"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="hidden"
        />

        {state.errors?.immagine && (
          <p className="text-sm text-destructive">
            {state.errors.immagine}
          </p>
        )}
      </div>

      <div className="rounded-lg border">
        <div className="flex items-center justify-between gap-4 border-b p-4">
          <div>
            <Label
              htmlFor={`vetrina-${elemento.id}`}
            >
              Mostra in vetrina
            </Label>

            <p className="text-sm text-muted-foreground">
              Evidenzia questo elemento nel menu.
            </p>
          </div>

          <Switch
            id={`vetrina-${elemento.id}`}
            name="vetrina"
            value="true"
            defaultChecked={
              elemento.vetrina === true
            }
          />
        </div>

        <div className="flex items-center justify-between gap-4 p-4">
          <div>
            <Label
              htmlFor={`attivo-${elemento.id}`}
            >
              Elemento attivo
            </Label>

            <p className="text-sm text-muted-foreground">
              Rende il prodotto visibile.
            </p>
          </div>

          <Switch
            id={`attivo-${elemento.id}`}
            name="attivo"
            value="true"
            defaultChecked={
              elemento.attivo === true
            }
          />
        </div>
      </div>

      {state.message && (
        <p
          className={
            state.success
              ? "text-sm text-green-600"
              : "text-sm text-destructive"
          }
        >
          {state.message}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={pending}
        >
          {pending
            ? "Aggiornamento..."
            : "Salva modifiche"}
        </Button>
      </div>
    </form>
  )
}