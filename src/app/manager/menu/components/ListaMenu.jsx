"use client";

import { useEffect, useMemo, useState } from "react";
import { FilterX, Filter, Store, Printer } from "lucide-react";
import FormMenu from "./FormMenu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectLabel } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import MenuCard from "./CardMenu";

export default function ListaMenu({ categorie = [], horeca }) {

  const [soloAttivi, setSoloAttivi] = useState(false);
  const [soloVetrina, setSoloVetrina] = useState(false);
  const [categoriaSelezionata, setCategoriaSelezionata] = useState("tutte");
  const [selectHoreca, setSelectHoreca] = useState("")
  const [elementiMenu, setElementiMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(null);
  const [update, setUpdate] = useState(0)

  useEffect(() => {
    if (horeca.length > 0 && !selectHoreca) {
      setSelectHoreca(horeca[0].id);
    }
  }, [horeca, selectHoreca]);

  async function recuperaMenu() {

    if (!selectHoreca) {
      setElementiMenu([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrore(null);

      const response = await fetch("/api/menu/horecaitems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          selectHoreca,
        }),
      });

      const risultato = await response.json();

      if (!response.ok || !risultato.success) {
        throw new Error(
          risultato.message ||
            "Impossibile recuperare gli elementi del menu"
        );
      }

      setElementiMenu(risultato.data ?? []);
    } catch (error) {
      console.error("Errore caricamento menu:", error);

      setErrore(
        error.message ||
          "Si è verificato un errore durante il caricamento del menu"
      );

      setElementiMenu([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    recuperaMenu();
    resetFiltri()
  }, [selectHoreca, update]);

  const categorieDisponibili = useMemo(() => {
    const categorieMap = new Map();

    elementiMenu.forEach((elemento) => {
      if (!elemento.id_categoria || !elemento.categoria) {
        return;
      }

      if (!categorieMap.has(elemento.id_categoria)) {
        categorieMap.set(elemento.id_categoria, {
          id: elemento.id_categoria,
          alias:
            elemento.categoria.alias ||
            elemento.id_categoria,
        });
      }
    });

    return Array.from(categorieMap.values()).sort(
      (a, b) =>
        a.alias.localeCompare(b.alias, "it", {
          sensitivity: "base",
        })
    );
  }, [elementiMenu]);

  const elementiFiltrati = useMemo(() => {
    return elementiMenu.filter((elemento) => {
      const corrispondeAttivo =
        !soloAttivi || elemento.attivo === true;

      const corrispondeVetrina =
        !soloVetrina || elemento.vetrina === true;

      const corrispondeCategoria =
        categoriaSelezionata === "tutte" ||
        elemento.id_categoria === categoriaSelezionata;

      return (
        corrispondeAttivo &&
        corrispondeVetrina &&
        corrispondeCategoria
      );
    });
  }, [
    elementiMenu,
    soloAttivi,
    soloVetrina,
    categoriaSelezionata,
  ]);

  const filtriAttivi = soloAttivi || soloVetrina || categoriaSelezionata !== "tutte";

  function resetFiltri() {
    setSoloAttivi(false);
    setSoloVetrina(false);
    setCategoriaSelezionata("tutte");
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="font-medium">
          Caricamento menu...
        </p>
      </div>
    );
  }

  if (errore) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-10 text-center">
        <p className="font-medium text-destructive">
          {errore}
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={recuperaMenu}
        >
          Riprova
        </Button>
      </div>
    );
  }

  if (!elementiMenu.length) {
    return (
      <div className="flex flex-col gap-4">
        <div className="">
          <FormMenu id_horeca={selectHoreca} titleButton="menu" categorie={categorie} setUpdate={setUpdate} padding={`p-4`} description={`Aggiungi elementi al tuo menu`}/>
        </div>
        <div className="flex flex-row w-full justify-between">
          <SelectCustom select={selectHoreca} setSelect={setSelectHoreca} item={horeca}/>
        </div>
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="font-medium">
            Nessun elemento presente nel menu
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Inserisci il primo piatto per iniziare.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row w-full max-w-full justify-between overflow-hidden">
        {horeca.length > 0 ?
        <div className="flex flex-row gap-2 items-center">
          <Store size={18} strokeWidth={2} className="text-red-700"/>
          <SelectCustom select={selectHoreca} setSelect={setSelectHoreca} item={horeca}/>
        </div> : null}
        <div className="flex flex-row items-center gap-2">
          <FormMenu id_horeca={selectHoreca} titleButton="menu" categorie={categorie} padding={`p-0`} description={``} setUpdate={setUpdate}/>
          {/* FILTRI */}
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex w-fit items-center justify-center gap-1 rounded-sm bg-red-800 px-3 py-1 text-neutral-50 transition-all hover:bg-red-700"
              >
                <Filter size={13} strokeWidth={2} />

                <span className="text-xs">
                  Filtra
                </span>
              </button>
            </DialogTrigger>

            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>
                  Filtra menu
                </DialogTitle>

                <DialogDescription>
                  Seleziona i filtri da applicare agli elementi
                  del menu.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-4 space-y-2">
                  <Select
                    value={categoriaSelezionata}
                    onValueChange={setCategoriaSelezionata}
                  >
                    <SelectTrigger
                      id="filtro-categoria"
                      className="w-full"
                    >
                      <SelectValue placeholder="Tutte le categorie" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="tutte">
                        Tutte le categorie
                      </SelectItem>

                      {categorieDisponibili.map(
                        (categoria) => (
                          <SelectItem
                            key={categoria.id}
                            value={categoria.id}
                          >
                            {categoria.alias}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 flex min-h-10 items-center justify-between gap-4 rounded-lg border px-3 py-2">
                  <Label
                    htmlFor="filtro-attivi"
                    className="cursor-pointer whitespace-nowrap"
                  >
                    Solo attivi
                  </Label>

                  <Switch
                    id="filtro-attivi"
                    checked={soloAttivi}
                    onCheckedChange={setSoloAttivi}
                  />
                </div>

                <div className="col-span-2 flex min-h-10 items-center justify-between gap-4 rounded-lg border px-3 py-2">
                  <Label
                    htmlFor="filtro-vetrina"
                    className="cursor-pointer whitespace-nowrap"
                  >
                    Solo in vetrina
                  </Label>

                  <Switch
                    id="filtro-vetrina"
                    checked={soloVetrina}
                    onCheckedChange={setSoloVetrina}
                  />
                </div>

                <div className="col-span-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetFiltri}
                    disabled={!filtriAttivi}
                    className="w-full"
                  >
                    <FilterX className="size-4" />
                    Azzera filtri
                  </Button>
                </div>

                <div className="col-span-1">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      className="w-full"
                    >
                      Chiudi
                    </Button>
                  </DialogClose>
                </div>
              </div>

              <DialogFooter />
            </DialogContent>
          </Dialog>
          {/* STAMPA */}
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex w-fit items-center justify-center gap-1 rounded-sm bg-red-800 px-3 py-[0.3rem] text-neutral-50 transition-all hover:bg-red-700"
              >
                <Printer size={14} strokeWidth={2} />
              </button>
            </DialogTrigger>

            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>
                  Stampa
                </DialogTitle>

                <DialogDescription>
                  Genere il tuo menu PDF
                </DialogDescription>
              </DialogHeader>

              QUI GENERATORE PDF

              <DialogFooter />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {!elementiFiltrati.length ? (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <p className="font-medium">
            Nessun elemento trovato
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Nessun elemento corrisponde ai filtri
            selezionati.
          </p>

          <Button type="button" variant="outline" onClick={resetFiltri} className="mt-4">
            <FilterX className="size-4" />
            Azzera filtri
          </Button>

        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 xl:grid-cols-6">
          {elementiFiltrati.map((elemento) => (
            <MenuCard
              key={elemento.id}
              elemento={elemento}
              categorie={categorie}
              onUpdated={recuperaMenu}
              setUpdate={setUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SelectCustom ({select, setSelect, item, placeholder = "scegli ...", label = "Elenco"}){
  return (
  <Select value={select} onValueChange={setSelect}>
    <SelectTrigger className="w-full max-w-48">
      <SelectValue placeholder={placeholder}/>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>{label}</SelectLabel>
        {item?.map((h) => (
          <SelectItem key={h.id} value={h.id}>
            {h.nome}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
  )
}