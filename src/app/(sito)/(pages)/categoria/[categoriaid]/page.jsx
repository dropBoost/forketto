import { notFound } from "next/navigation";
import { getHorecaByAlias } from "@/lib/horeca/getHorecaByAlias";
import { Spinner } from "@/components/ui/spinner";
import { getMenuItemsCategorieByID } from "@/lib/menu/getMenuItemsCategorieByID";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { getHorecaConfigurazioneByID } from "@/lib/horeca/getHorecaSettingsById";
import { getMenuCategorieByID } from "@/lib/menu/getMenuCategorieByID";

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

  console.log(categoria)

  return (
    <div className="flex flex-col p-5 rounded-b-lg flex-1 gap-5 w-full max-w-7xl">
      <div>
        <span className="border rounded-3xl px-5 py-2 text-3xl">{categoria.alias}</span>
      </div>
      <div className="grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 w-full">

        {horecaConSettings?.map(async (h) => {
        
        const settings = await getHorecaConfigurazioneByID(h.id)
        const indirizzo = `${h.indirizzo}, ${h.civico} - ${h.cap} ${h.citta} ${h.provincia}`

        return(
          <Link key={h.id} className={`w-full`} href={`/horeca/${h.alias}`}>
            <Card className={`p-0 pt-5`}>
              <CardHeader className={`flex flex-col`}>
                <span>{h.nome}</span>
                <span>{h.alias}</span>
              </CardHeader>
              <div className={`w-full border`}>
                <Image className="min-w-full object-cover h-40" src={settings?.settings?.cover} width={150} height={150} quality={70} alt={`${h.alias} _ forketto`}/>
              </div>
              <CardContent className={`flex flex-col items-center`}>
                <Image className="rounded-full h-20 w-20" src={settings?.settings?.logo} width={150} height={150} quality={70} alt={`${h.alias} _ forketto`}/>
              </CardContent>
              <CardFooter className={`bg-primary p-1`}>
                {indirizzo}
              </CardFooter>
            </Card>
          </Link>
        )})}
      </div>
    </div>
  );

}