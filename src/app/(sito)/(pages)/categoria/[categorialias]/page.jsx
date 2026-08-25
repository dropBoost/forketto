import { getMenuItemsCategorieByID } from "@/lib/menu/getMenuItemsCategorieByID";
import { getMenuCategorieByAlias } from "@/lib/menu/getMenuCategorieByAlias";
import { Utensils } from "lucide-react";
import { getHorecaConfigurazioneByID } from "@/lib/horeca/getHorecaSettingsById";
import HorecaCard from "@/components/sito/theme/horecaCard";

export async function generateMetadata({ params }) {

  const { categorialias } = await params;
  const categoria = await getMenuCategorieByAlias(categorialias)

  return {
    title: `Forketto | ${categoria.alias.toUpperCase() ?? "Categoria"}`,
    description: `Scopri i locali della categoria ${categoria ?? ""} su Forketto.`,
  };

}

export default async function HorecaSitoPAGE({ params }) {

  const { categorialias } = await params;
  const categoria = await getMenuCategorieByAlias(categorialias)
  const itemsMenu = await getMenuItemsCategorieByID(categoria.id)
  const horeca = [ ...new Map(itemsMenu.map((item) => [item.horeca.id, item.horeca])).values()];
  
  const horecaConSettings = await Promise.all(
    horeca.map(async (h) => {
      const settings = await getHorecaConfigurazioneByID(h.id);
      return { ...h, settings };
    })
  );

  return (
    <div className="flex flex-col rounded-b-lg flex-1 w-full max-w-7xl">
      <div className="flex flex-row items-center justify-start text-neutral-600 p-3 px-5 gap-2 border-b">
        <Utensils strokeWidth={3} size={16} className="text-primary"/>
        <h3 className="lowercase font-light text-sm text-neutral-600">{categoria.alias}</h3>
      </div>
      <div className="flex-1 grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 p-5 w-full">

        {horecaConSettings?.map(async (h) => {
        
        const settings = await getHorecaConfigurazioneByID(h.id)
        const indirizzo = `${h.indirizzo}, ${h.civico} - ${h.cap} ${h.citta} ${h.provincia}`

        return(
          <HorecaCard h={h} settings={settings} indirizzo={indirizzo}/>
        )})}
      </div>
    </div>
  );

}

