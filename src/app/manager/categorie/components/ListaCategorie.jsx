"use client";

import { useEffect, useMemo, useState } from "react";
import { FilterX, Filter, Store, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, SelectLabel } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/utils/supabase/client";

export default function ListaCategorie({ horeca }) {

  
  const [selectHoreca, setSelectHoreca] = useState("")
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(null);
  const [update, setUpdate] = useState(0)
  const supabase = createClient();
  const [categorieHoreca, setCategorieHoreca] = useState([]);
  
  useEffect(() => {
    if (horeca.length > 0 && !selectHoreca) {
      setSelectHoreca(horeca[0].id);
    }
  }, [horeca, selectHoreca]);

  useEffect(() => {

    let annullato = false;

    if (!selectHoreca) {
      setCategorieHoreca([]);
      return;
    }

    async function caricaCategorie() {
      const { data, error } = await supabase
        .from("menu_categoria_horeca")
        .select("id, alias, id_horeca")
        .eq("id_horeca", selectHoreca);

      if (annullato) return;

      if (error) {
        console.error("Errore caricamento categorie:", error);
        setCategorieHoreca([]);
        return;
      }

      setCategorieHoreca(data ?? []);
      setLoading(false)
    }

    caricaCategorie();

    return () => {
      annullato = true;
    };
  }, [selectHoreca, update]);


  if (loading) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <p className="font-medium">
          Caricamento categorie...
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex xl:flex-row flex-col w-full max-w-full xl:justify-end justify-center xl:items-center items-start gap-3 p-3 bg-muted/50 rounded-lg overflow-hidden">
        {horeca.length > 0 ?
          <div className="flex flex-1 flex-row gap-2 items-center xl:justify-start justify-center w-full">
            <Store size={18} strokeWidth={2} className="text-red-700"/>
            <SelectCustom select={selectHoreca} setSelect={setSelectHoreca} item={horeca}/>
          </div> 
        : null}
      </div>
      <div className="flex flex-col items-center gap-2">
        {categorieHoreca.map(c => (
          <span className="w-full border">{c.id}</span>
        ))}
      </div>
    </div>
  );
}

function SelectCustom ({select, setSelect, item, placeholder = "scegli ...", label = "Elenco"}){
  return (
  <Select value={select} onValueChange={setSelect}>
    <SelectTrigger className="w-full xl:max-w-48">
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