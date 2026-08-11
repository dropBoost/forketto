"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Frown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import HorecaSocialLink from "./horecaSocial";

export default function PageHorecaUI({ horeca, theme, menu }) {

  const [ricerca, setRicerca] = useState("");
  const settings = horeca.settings.settings

  const menuFiltrato = useMemo(() => {
    const search = ricerca.toLowerCase().trim();

    return (
      menu?.filter((m) => {
        if (!m.attivo) return false;

        const nome = m.nome?.toLowerCase() ?? "";
        const categoria = m.categoria?.alias?.toLowerCase() ?? "";

        const matchRicerca =
          search === "" ||
          nome.includes(search) ||
          categoria.includes(search);

        return matchRicerca;
      }) ?? []
    );
  }, [menu, ricerca]);

  const menuPerCategoria = useMemo(() => {
    const menuOrdinato = [...menuFiltrato].sort((a, b) => {
      const ordineA = a.categoria?.order ?? 999;
      const ordineB = b.categoria?.order ?? 999;

      return ordineA - ordineB;
    });

    return menuOrdinato.reduce((acc, item) => {
      const categoria = item.categoria?.alias ?? "altro";

      if (!acc[categoria]) {
        acc[categoria] = [];
      }

      acc[categoria].push(item);

      return acc;
    }, {});
  }, [menuFiltrato]);

  if (!horeca || !theme || horeca.attivo === false) {
    return (
      <div className="flex flex-col items-center justify-center bg-primary h-screen w-screen overflow-hidden">
        <div className="flex flex-col gap-3 items-center justify-center border p-10 rounded-2xl">
          <Frown className="text-secondary" size={70} />
          <span className="text-secondary">Attività non attiva o non disponibile</span>
          <Link className="bg-secondary px-3 text-sm rounded-lg" href={`/horeca`}>Torna all'elenco delle attività</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full xl:p-0 px-4">
      <div className="flex flex-col gap-4 max-w-7xl w-full bg-neutral-50 p-7 rounded-t-4xl">

        <div id="infosection" className="flex flex-col">
          <div className="aspect-16/4 rounded-t-4xl" style={theme.cover} />
          <div className="flex flex-row items-center lg:h-30 h-20 lg:p-4 p-3 rounded-b-4xl" style={theme.header} >
            <Image className="w-fit rounded-full max-h-full" src={settings.logo} width={100} height={100} alt={`logo_${horeca.nome}`}/>
            <div className="flex flex-col flex-1 p-5 items-start justify-center ">
              <h2 className="lg:text-3xl text-md font-extrabold text-ellipsis text-neutral-900">{horeca.nome}</h2>
              <h3 className="text-xs text-neutral-500 italic">@{horeca.alias}</h3>
            </div>
            <div className="flex flex-row p-5 items-start justify-center ">
              <HorecaSocialLink instagram={settings.instagram} facebook={settings.facebook} tiktok={settings.tiktok}/>
            </div>
          </div>
        </div>
        {/* FILTRI */}
        <div className="flex flex-col gap-4">

          {/* RICERCA */}
          <div className="relative w-full">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              value={ricerca}
              onChange={(e) => setRicerca(e.target.value)}
              placeholder="Cerca piatto o categoria..."
              className="pl-10"
            />

          </div>
          
          {/* CATEGORIE */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.keys(menuPerCategoria).map((categoria) => {

              const categoriaId = categoria.toLowerCase().replace(/\s+/g, "-")

              return (
                <Button key={categoria} asChild>
                  <Link href={`#${categoriaId}`}>
                    {categoria}
                  </Link>
                </Button>
              )
            })}
          </div>

        </div>



        {/* MENU */}
        <div className="flex flex-col gap-10">

          {Object.entries(menuPerCategoria).map(
            ([categoria, items]) =>  {

              const categoriaId = categoria.toLowerCase().replace(/\s+/g, "-")
              
              return (
              <section key={categoria} id={categoriaId} className="flex flex-col gap-4">
                <h2 className="text-2xl font-black uppercase"> {categoria} </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                  {items.map((m) => (

                    <div key={m.id} className="flex flex-col gap-2 rounded-xl p-4 border">
                      <div className="flex flex-col items-start justify-between gap-4">
                      {m.immagine && <Image className="min-w-full aspect-square rounded-xl object-center object-cover" src={m.immagine} width={500} height={500} alt={`${m.nome} - ${horeca.nome}`}/>}
                      <h3 className="font-bold text-lg"> {m.nome} </h3>
                      {/* PREZZO */}
                      <div className="flex items-center gap-2 shrink-0">
                        {m.prezzo_promo ? (
                          <>
                            <span className="text-sm text-muted-foreground line-through">
                              € {Number(m.prezzo_listino).toFixed(2)}
                            </span>

                            <span className="font-bold">
                              € {Number(m.prezzo_promo).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold">
                            € {Number(m.prezzo_listino).toFixed(2)}
                          </span>
                        )}

                      </div>
                      </div>
                      {m.descrizione && ( <p> {m.descrizione} </p> )}
                      {m.ingredienti && ( <p className="text-sm text-muted-foreground"> {m.ingredienti} </p> )}
                    </div>
                  ))}

                </div>
              </section>
              )
            }
          )}
          {menuFiltrato.length === 0 && (
            <div className="py-10 text-center text-muted-foreground">
              Nessun elemento trovato.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}