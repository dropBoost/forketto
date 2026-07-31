"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { Loader2, Plus, Soup, ImagePlus, Trash2 } from "lucide-react";
import { createMenuAction } from "../actions/createMenuActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const initialState = {
  success: false,
  message: "",
  errors: {},
  values: {},
};

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
];

export default function FormMenu({ id_horeca, categorie = [], titleButton = "Aggiungi", description, padding = "p-8", iconSize = 16, setUpdate }) {

  const formRef = useRef(null)
  const fileInputRef = useRef(null)
  const [previewImmagine, setPreviewImmagine] = useState(null)
  const [nomeImmagine, setNomeImmagine] = useState("")

  const [state, formAction, pending] = useActionState(
    createMenuAction,
    initialState
  );

  useEffect(() => {
    return () => {
      if (previewImmagine) {
        URL.revokeObjectURL(previewImmagine);
      }
    };
  }, [previewImmagine]);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();

      if (previewImmagine) {
        URL.revokeObjectURL(previewImmagine);
      }

      setPreviewImmagine(null);
      setNomeImmagine("");
      setUpdate(prev => prev+1)

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    }
  }, [state.success]);


  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setPreviewImmagine(null);
      setNomeImmagine("");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      event.target.value = "";
      setPreviewImmagine(null);
      setNomeImmagine("");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      event.target.value = "";
      setPreviewImmagine(null);
      setNomeImmagine("");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setPreviewImmagine((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }

      return previewUrl;
    });

    setNomeImmagine(file.name);
  }

  function removeImage() {
    if (previewImmagine) {
      URL.revokeObjectURL(previewImmagine);
    }

    setPreviewImmagine(null);
    setNomeImmagine("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
  <Dialog className={`max-h-screen`}>
    <DialogTrigger className={`flex flex-col w-full gap-2 items-center justify-center ${padding} dark:bg-primary/20 bg-secondary-foreground/5 rounded-2xl`}>
      <div className="flex flex-row gap-1 bg-red-800 px-3 dark:hover:bg-muted transition-all py-1 rounded-sm text-neutral-50 items-center justify-center">
        <Plus size={iconSize} strokeWidth={2}/>
        {titleButton !== "" ? <span className="text-xs">{titleButton}</span> : null}
      </div>
      {description && <CardDescription>{description}</CardDescription>}
    </DialogTrigger>
    <DialogContent showCloseButton={false}>
      <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Soup className="size-5" />
            </div>
            <div>
            <DialogTitle>
              Nuovo elemento menu
            </DialogTitle>
            <DialogDescription>
              Inserisci un nuovo elemento al menu
            </DialogDescription>
            </div>
          </div>
      </DialogHeader>
      <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4">
        <div className="border rounded-2xl p-4 w-full mb-1">
          <form ref={formRef} action={formAction} className="grid grid-cols-2 gap-6" id="form-menu-item">
            <input type="hidden" name="id_horeca" value={id_horeca}/>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="nome">Nome</Label>

              <Input id="nome" name="nome" placeholder="Margherita / Spaghetti / ecc.." defaultValue={state.values?.nome || ""}
              />

              {state.errors?.nome && (
                <p className="text-sm text-destructive">
                  {state.errors.nome}
                </p>
              )}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="id_categoria">
                Categoria
              </Label>

              <Select name="id_categoria" defaultValue={state.values?.id_categoria || undefined}>
                <SelectTrigger id="id_categoria" className={`w-full`}>
                  <SelectValue placeholder="Seleziona una categoria" />
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

            <div className="space-y-2 col-span-2">
              <Label htmlFor="descrizione">
                Descrizione
              </Label>

              <Textarea
                id="descrizione"
                name="descrizione"
                placeholder="Inserisci una breve descrizione"
                defaultValue={
                  state.values?.descrizione || ""
                }
                rows={4}
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="ingredienti">
                Ingredienti
              </Label>

              <Textarea
                id="ingredienti"
                name="ingredienti"
                placeholder="Pomodoro, mozzarella, basilico..."
                defaultValue={
                  state.values?.ingredienti || ""
                }
                rows={4}
              />
            </div>

            <div className="space-y-3 col-span-2">
              <div>
                <Label>Allergeni</Label>

                <p className="mt-1 text-sm text-muted-foreground">
                  Seleziona gli allergeni presenti nel piatto.
                </p>
              </div>

              <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
                {allergeniDisponibili.map((allergene) => (
                  <div
                    key={allergene.key}
                    className="flex items-center gap-3"
                  >
                    <Checkbox
                      id={`allergene-${allergene.key}`}
                      name={`allergene_${allergene.key}`}
                      value="true"
                      defaultChecked={
                        state.values?.allergeni?.[
                          allergene.key
                        ] === true
                      }
                    />

                    <Label
                      htmlFor={`allergene-${allergene.key}`}
                      className="cursor-pointer font-normal"
                    >
                      {allergene.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 col-span-2 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prezzo_listino">
                  Prezzo di listino
                </Label>

                <Input
                  id="prezzo_listino"
                  name="prezzo_listino"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  defaultValue={
                    state.values?.prezzo_listino || ""
                  }
                />

                {state.errors?.prezzo_listino && (
                  <p className="text-sm text-destructive">
                    {state.errors.prezzo_listino}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="prezzo_promo">
                  Prezzo promozionale
                </Label>

                <Input
                  id="prezzo_promo"
                  name="prezzo_promo"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Opzionale"
                  defaultValue={
                    state.values?.prezzo_promo || ""
                  }
                />

                {state.errors?.prezzo_promo && (
                  <p className="text-sm text-destructive">
                    {state.errors.prezzo_promo}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="immagine">
                Immagine del piatto
              </Label>

              {!previewImmagine ? (
                <label
                  htmlFor="immagine"
                  className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center transition-colors hover:bg-muted/50"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <ImagePlus className="size-5 text-muted-foreground" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Seleziona un'immagine
                    </p>

                    <p className="text-xs text-muted-foreground">
                      JPG, PNG oppure WEBP. Massimo 5 MB.
                    </p>
                  </div>
                </label>
              ) : (
                <div className="overflow-hidden rounded-lg border">
                  <div className="relative aspect-video w-full bg-muted">
                    <img
                      src={previewImmagine}
                      alt="Anteprima del piatto"
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">
                        Immagine selezionata
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {nomeImmagine}
                      </p>
                    </div>

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
              )}

              <Input
                ref={fileInputRef}
                id="immagine"
                name="immagine"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              {previewImmagine && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="size-4" />
                  Scegli un'altra immagine
                </Button>
              )}

              {state.errors?.immagine && (
                <p className="text-sm text-destructive">
                  {state.errors.immagine}
                </p>
              )}
            </div>

            <div className="rounded-lg border col-span-2">
              <div className="flex items-center justify-between gap-4 border-b p-4">
                <div className="space-y-1">
                  <Label htmlFor="vetrina">
                    Mostra in vetrina
                  </Label>

                  <p className="text-sm text-muted-foreground">
                    Evidenzia il piatto nel menu.
                  </p>
                </div>

                <Switch
                  id="vetrina"
                  name="vetrina"
                  value="true"
                  defaultChecked={
                    state.values?.vetrina === true
                  }
                />
              </div>

              <div className="flex items-center justify-between gap-4 p-4">
                <div className="space-y-1">
                  <Label htmlFor="attivo">
                    Piatto attivo
                  </Label>

                  <p className="text-sm text-muted-foreground">
                    Rende il piatto visibile nel menu.
                  </p>
                </div>

                <Switch
                  id="attivo"
                  name="attivo"
                  value="true"
                  defaultChecked={
                    state.values?.attivo !== undefined
                      ? state.values.attivo
                      : true
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

            
          </form>
        </div>
      </div>
      <DialogFooter className={``}>
        <Button type="submit" disabled={pending} className="w-full" form="form-menu-item">
          {pending ?  <>
            <Loader2 className="animate-spin" />
            Salvataggio... </> : 
          <div className="flex flex-row items-center gap-1 justify-center">
            <Plus/> Aggiungi elemento
          </div>
          }
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  );
}