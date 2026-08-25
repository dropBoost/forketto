"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Loader2, Plus, ImagePlus, Trash2, Pizza, Goal, Settings } from "lucide-react";
import { createCategoriaAction } from "../actions/createCategoriaActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { createClient } from "@/utils/supabase/client";

const initialState = {
  success: false,
  message: "",
  errors: {},
  values: {},
};

export default function FormCategoria({ id_horeca, supercategorie = [], titleButton = "Aggiungi", description, padding = "p-8", iconSize = 16, setUpdate }) {

  const formRef = useRef(null)
  const fileInputRef = useRef(null)
  const [previewImmagine, setPreviewImmagine] = useState(null)
  const [nomeImmagine, setNomeImmagine] = useState("")
  const [selectSupercategoria, setSelectSupercategoria] = useState("")
  const [loading, setLoading] = useState(false)
  const [categorieEsistenti, setCategorieEsistenti] = useState([])
  const supabase = createClient()
  const [state, formAction, pending] = useActionState(
    createCategoriaAction,
    initialState
  );
  const [categoriaConsigliata, setCategoriaConsigliata] = useState( state.values?.alias || "" )
  const [controlloAlias, setControlloAlias] = useState(false)
  const [aliasEsistente, setAliasEsistente] = useState(false)
  const [erroreControlloAlias, setErroreControlloAlias] = useState("")
  const [numeroCategorie, setNumeroCategorie] = useState(0)
  const [loadingConteggio, setLoadingConteggio] = useState(false)

  useEffect(() => {
    if (!id_horeca) {
      setNumeroCategorie(0)
      return
    }

    let active = true

    async function getNumeroCategorie() {
      setLoadingConteggio(true)

      const { count, error } = await supabase
        .from("menu_categoria_horeca")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("id_horeca", id_horeca)

      if (!active) return

      if (error) {
        console.error(
          "Errore conteggio categorie:",
          error.message
        )

        setNumeroCategorie(0)
      } else {
        setNumeroCategorie(count ?? 0)
      }

      setLoadingConteggio(false)
    }

    getNumeroCategorie()

    return () => {
      active = false
    }
  }, [id_horeca, state])  

  useEffect(() => {
    const alias = categoriaConsigliata.trim()

    setAliasEsistente(false)
    setErroreControlloAlias("")

    if (!alias || !id_horeca) {
      setControlloAlias(false)
      return
    }

    let active = true

    setControlloAlias(true)

    const timeout = setTimeout(async () => {
      const { data, error } = await supabase
        .from("menu_categoria_horeca")
        .select("id")
        .eq("id_horeca", id_horeca)
        .ilike("alias", alias)
        .limit(1)

      if (!active) return

      if (error) {
        console.error(
          "Errore controllo alias categoria:",
          error.message
        )

        setErroreControlloAlias(
          "Non è stato possibile verificare la categoria."
        )
        setAliasEsistente(false)
      } else {
        setAliasEsistente((data?.length ?? 0) > 0)
      }

      setControlloAlias(false)
    }, 500)

    return () => {
      active = false
      clearTimeout(timeout)
    }
  }, [categoriaConsigliata, id_horeca])  

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

  useEffect(() => {

    if (!selectSupercategoria) return

    let active = true

    async function getCategorie() {
      setLoading(true)

      try {

        const { data, error } = await supabase
          .from("menu_categorie_singole")
          .select("*")
          .eq("id_supercategoria", selectSupercategoria)
          .limit(10)
          .order("utilizzi", { ascending: false })

        if (!active) return

        if (error) {
          console.error(
            "Errore caricamento categorie esistenti:",
            error.message
          )

          setCategorieEsistenti([])
          return
        }

        setCategorieEsistenti(data ?? [])

      } catch (error) {
        if (!active) return
        console.error("Errore imprevisto:", error)
        setCategorieEsistenti([])
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    getCategorie()

    return () => {
      active = false
    }

  }, [selectSupercategoria])

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
    <DialogTrigger className={`flex flex-col gap-2 items-center justify-center ${padding} dark:bg-primary/20 bg-secondary-foreground/5 rounded-2xl`}>
      <div className="flex flex-row gap-1 bg-red-800 px-3 dark:hover:bg-muted transition-all py-1 rounded-sm text-neutral-50 items-center justify-center">
        <Plus size={iconSize} strokeWidth={2}/>
        {titleButton !== "" ? <span className="text-xs">{titleButton}</span> : null}
      </div>
      {description && <CardDescription>{description}</CardDescription>}
    </DialogTrigger>
    {numeroCategorie >= 10 ?
    <DialogContent showCloseButton={false}>
      <DialogHeader className={`border p-5 rounded-2xl`}>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Goal className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <DialogTitle>
                Categorie attive {numeroCategorie}/10
              </DialogTitle>
              <DialogDescription className={`bg-primary text-neutral-50 px-1 rounded-sm`}>
                Limite Categorie Raggiunto
              </DialogDescription>
            </div>
          </div>
      </DialogHeader>
      <DialogFooter>
        <Link href="/manager/menu/categorie">
          <Button>Gestisci categorie</Button>
        </Link>
        <DialogClose asChild ><Button type="button" variant="secondary">Chiudi</Button></DialogClose>
      </DialogFooter>
    </DialogContent> :
    <DialogContent showCloseButton={false} onPointerDownOutside={() => setSelectSupercategoria("")}>
      <DialogHeader className={`flex flex-row`}>
          <div className="flex flex-1 items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Pizza className="size-5" />
            </div>
            <div>
            <DialogTitle>
              Nuova Categoria
            </DialogTitle>
            <DialogDescription>
              Inserisci una nuova categoria
            </DialogDescription>
            </div>
          </div>
          <div>
          <Link href="/manager/menu/categorie">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Settings className="size-5 text-neutral-50/40 hover:text-neutral-50 transition-all delay-50"/>
            </div>
          </Link>
          </div>
      </DialogHeader>
      <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4">
        <div className="border rounded-2xl p-4 w-full mb-2">
          <form ref={formRef} action={formAction} className="flex flex-col gap-2" id="form-menu-item">

            <input type="hidden" name="id_horeca" value={id_horeca}/>
            {/* SUPERCATEGORIA */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="id_supercategoria">
                Supercategoria
              </Label>

              <Select name="id_supercategoria" defaultValue={state.values?.id_supercategoria || undefined} onValueChange={setSelectSupercategoria}>
                <SelectTrigger id="id_supercategoria" className={`w-full`}>
                  <SelectValue placeholder="Seleziona una supercategoria" />
                </SelectTrigger>

                <SelectContent>
                  {supercategorie.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={String(c.id)}
                    >
                      {c.alias}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {state.errors?.id_supercategoria && (
                <p className="text-sm text-destructive">
                  {state.errors.id_supercategoria}
                </p>
              )}
            </div>
            <div className={` grid-cols-1 gap-6 ${selectSupercategoria ? "grid" : "hidden"}`}>
              {/* TOP 10 CATEGORIE */}
              <div className="space-y-2 col-span-2">
                <Label>Top 10 categorie</Label>

                {loading ? (
                  <p className="text-sm text-muted-foreground">
                    Caricamento categorie...
                  </p>
                ) : categorieEsistenti.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {categorieEsistenti.map((categoria) => (
                      <Button
                        key={`${categoria.id_supercategoria}-${categoria.alias}`}
                        type="button"
                        size="sm"
                        variant={
                          categoriaConsigliata === categoria.alias
                            ? "default"
                            : "outline"
                        }
                        onClick={() => setCategoriaConsigliata(categoria.alias)}
                        className={`flex flex-row items-center justify-center`}
                      >
                        {categoria.alias}

                        <span className="text-[0.6rem] opacity-60">
                          {categoria.utilizzi}
                        </span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Nessuna categoria suggerita.
                  </p>
                )}
              </div>            
              {/* ALIAS */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="alias">
                  Nome categoria
                </Label>

                <Input
                  id="alias"
                  name="alias"
                  placeholder="pizza / panini / gelati / ecc..."
                  value={categoriaConsigliata}
                  onChange={(event) => {
                    setCategoriaConsigliata(event.target.value)
                  }}
                  aria-invalid={
                    aliasEsistente ||
                    Boolean(state.errors?.alias)
                  }
                />

                {controlloAlias && (
                  <p className="text-sm text-muted-foreground">
                    Verifica disponibilità...
                  </p>
                )}

                {!controlloAlias && aliasEsistente && (
                  <p className="text-sm text-destructive">
                    Hai già creato una categoria con questo nome.
                  </p>
                )}

                {!controlloAlias &&
                  categoriaConsigliata.trim() &&
                  !aliasEsistente &&
                  !erroreControlloAlias && (
                    <p className="text-sm text-green-600">
                      Nome categoria disponibile.
                    </p>
                  )}

                {erroreControlloAlias && (
                  <p className="text-sm text-destructive">
                    {erroreControlloAlias}
                  </p>
                )}

                {state.errors?.alias && !aliasEsistente && (
                  <p className="text-sm text-destructive">
                    {state.errors.alias}
                  </p>
                )}
              </div>
              {/* DESCRIZIONE */}
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
              {/* COVER */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="immagine">
                  Copertina
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
              {/* ATTIVA */}
              <div className="rounded-lg border col-span-2">

                <div className="flex items-center justify-between gap-4 p-4">
                  <div className="space-y-1">
                    <Label htmlFor="attivo">
                      Attiva
                    </Label>

                    <p className="text-xs text-muted-foreground">
                      Rende la categoria visibile al pubblico.
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
            </div>
            {/* MESSAGGI DI STATO */}
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
      <DialogFooter className={`flex flex-row`}>
        <Button type="submit" disabled={ pending || controlloAlias || aliasEsistente } className="flex-1" form="form-menu-item">
          {pending ?  <>
            <Loader2 className="animate-spin" />
            Salvataggio... </> : 
          <div className="flex flex-row items-center gap-1 justify-center">
            <Plus/> Aggiungi elemento
          </div>
          }
        </Button>
        <DialogClose asChild ><Button type="button" onClick={()=>setSelectSupercategoria("")}>Chiudi</Button></DialogClose>
      </DialogFooter>
    </DialogContent>}
  </Dialog>
  );
}