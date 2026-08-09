import { notFound } from "next/navigation";
import { getHorecaByAlias } from "@/lib/horeca/getHorecaByAlias";
import { Spinner } from "@/components/ui/spinner";
import { getMenuItemsCategorieByID } from "@/lib/menu/getMenuItemsCategorieByID";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Utensils } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getHorecaConfigurazioneByID } from "@/lib/horeca/getHorecaSettingsById";
import { getMenuCategorieByID } from "@/lib/menu/getMenuCategorieByID";

export async function generateMetadata({ params }) {

  const { categoriaid } = await params;

  const categoria = await getMenuCategorieByID(categoriaid);

  return {
    title: `Forketto | ${categoria?.alias.toUpperCase() ?? "Categoria"}`,
    description: `Scopri i locali della categoria ${categoria?.alias ?? ""} su Forketto.`,
  };
}

export default async function HorecaSitoPAGE({ params }) {

  const { categoriaid } = await params;
  const categoria = await getMenuCategorieByID(categoriaid)
  const itemsMenu = await getMenuItemsCategorieByID(categoriaid)
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
          <CardHoreca h={h} settings={settings} indirizzo={indirizzo}/>
        )})}
      </div>
    </div>
  );

}

export function CardHoreca ({h, settings, indirizzo}) {

  return (
    <Link key={h.id} className={`w-full`} href={`/horeca/${h.alias}`}>
      <Card className={`p-0 pt-5`}>
        <CardHeader className={`flex flex-col gap-0`}>
          <h4 className="text-lg font-bold text-neutral-700">{h.nome}</h4>
          <p className="italic">@{h.alias}</p>
        </CardHeader>
        <div className={`w-full border`}>
          <Image className="min-w-full object-cover h-40" src={settings?.settings?.cover} width={150} height={150} quality={70} alt={`${h.alias} _ forketto`}/>
        </div>
        <CardContent className={`flex flex-col items-center`}>
          <Image className="rounded-full h-20 w-20" src={settings?.settings?.logo} width={150} height={150} quality={70} alt={`${h.alias} _ forketto`}/>
        </CardContent>
        <CardFooter className={`bg-primary p-2`}>
          <span className="text-neutral-200">{indirizzo}</span>
        </CardFooter>
      </Card>
    </Link>
  )

}