'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import {  ImageOff, Pencil, Eye, Sparkles } from "lucide-react";
import FormModificaMenu from "./FormMenuModifica";
import { Button } from "@/components/ui/button";
import ButtonSwitchBoolean from "@/components/button-switch-bool/ButtonSwitchBoolean";
import DeleteRecordButton from "@/components/button-delete-image/DeleteRecordButton";

export default function MenuCard({ elemento, categorie, onUpdated, setUpdate }) {

  const [open, setOpen] = useState(false);

  const prezzoListino = Number( elemento.prezzo_listino || 0 );

  const prezzoPromo =
    elemento.prezzo_promo !== null &&
    elemento.prezzo_promo !== undefined &&
    elemento.prezzo_promo !== "" ? Number(elemento.prezzo_promo) : null;

  async function gestisciSuccesso() {

    setOpen(false);
    if (onUpdated) {
      await onUpdated();
    }

  }

  return (
    <Card className="justify-between gap-3 overflow-hidden">
      <div className="aspect-square w-full overflow-hidden bg-muted">
        {elemento.immagine ? (
          <img
            src={elemento.immagine}
            alt={
              elemento.nome ||
              "Immagine piatto"
            }
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="size-8" />

            <span className="text-sm">
              Nessuna immagine
            </span>
          </div>
        )}
      </div>

      <CardHeader className="space-y-1">
        <div className="flex flex-col items-start justify-between gap-3">
          <div className="flex flex-wrap justify-end gap-1">
            <ButtonSwitchBoolean
              table="menu"
              id={elemento.id}
              field="attivo"
              value={elemento.attivo}
              iconTrue={<Eye className="size-4"/>}
              iconFalse={<Eye className="size-4"/>}
              colorButton="bg-red-700 text-white hover:bg-muted"
            />
            <ButtonSwitchBoolean
              table="menu"
              id={elemento.id}
              field="vetrina"
              value={elemento.vetrina}
              iconTrue={<Sparkles className="size-4"/>}
              iconFalse={<Sparkles className="size-4"/>}
              colorButton="bg-yellow-600 text-white hover:bg-muted"
            />
          </div>

          <div className="min-w-0 max-w-full">
            <CardTitle className="truncate text-xs">
              {elemento.nome ||
                "Senza nome"}
            </CardTitle>

            {elemento.categoria?.alias && (
              <p className="mt-1 text-xs uppercase italic text-muted-foreground">
                {elemento.categoria.alias}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-1">
        {elemento.descrizione && (
          <p className="line-clamp-3 text-xs text-muted-foreground">
            {elemento.descrizione}
          </p>
        )}

        {elemento.ingredienti && (
          <div className="rounded-xl border px-2 py-3">
            <p className="text-xs font-medium">
              Ingredienti:
            </p>

            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {elemento.ingredienti}
            </p>
          </div>
        )}
      </CardContent>

      <div className="flex flex-col justify-between">
        <CardContent className="mt-3">
          <div className="flex flex-wrap items-end gap-2 py-2 px-3 rounded-2xl bg-red-700/20">
            {prezzoPromo !== null ? (
              <>
                <span className="text-xl font-semibold">
                  € {prezzoPromo.toFixed(2)}
                </span>

                <span className="text-sm text-muted-foreground line-through">
                  € {prezzoListino.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-semibold">
                € {prezzoListino.toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className={`w-full gap-1`}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild className={`flex-1`}>
            <Button type="button" variant="outline" className="w-full h-fit p-1">
              <Pencil className="size-4" />
              Modifica
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                Modifica elemento
              </DialogTitle>

              <DialogDescription>
                Aggiorna i dati di{" "}
                {elemento.nome}.
              </DialogDescription>
            </DialogHeader>

            <FormModificaMenu
              elemento={elemento}
              categorie={categorie}
              onSuccess={gestisciSuccesso}
            />
          </DialogContent>
        </Dialog>
        <DeleteRecordButton
          table="menu"
          id={elemento.id}
          idField="id"
          bucket="menu"
          imageField="immagine"
          title="Elimina piatto"
          className="h-full aspect-square"
          setUpdate={setUpdate}
          description={`Vuoi eliminare definitivamente “${elemento.nome}”? Verrà eliminata anche l'immagine associata.`}
        />
      </CardFooter>
    </Card>
  );
}