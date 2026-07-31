import { redirect } from "next/navigation";
import { getHorecaByID } from "@/lib/horeca/getHorecaByID";
import { getHorecaSettingsVerifiedByID } from "@/lib/horeca/getHorecaSettingsVerifiedByID";
import { creaHorecaSettingsDefault } from "../../actions/creaHorecaSettingsDefault";
import { Spinner } from "@/components/ui/spinner";
import UpdateSettingsHoreca from "../../components/updateSettingsHoreca";
import { getHorecaThemeByID } from "@/lib/horeca/getHorecaThemeByID";
import GoogleMaps from "@/components/maps/googleMaps";
import { Separator } from "@/components/ui/separator";

export default async function GestioneHorecaPAGE({ params }) {

  const { idhoreca } = await params;
  const horeca = await getHorecaByID(idhoreca);
  const hs = horeca?.settings?.settings
  const theme = await getHorecaThemeByID(idhoreca)
  const indirizzo = `${horeca.indirizzo}, ${horeca.civico} - ${horeca.cap} ${horeca.citta} ${horeca.provincia}`
  console.log(hs)

  if (!idhoreca || !horeca) {
    return <div>Caricamento</div>;
  }

  const settingsVerified = await getHorecaSettingsVerifiedByID(idhoreca);

  if (!settingsVerified) {
    await creaHorecaSettingsDefault(idhoreca);
    redirect(`/manager/horeca/settings/${idhoreca}`);
  }
  
  if (!settingsVerified) {
    return (
    <div className="flex flex-col gap-2 items-center justify-center bg-primary/20 p-8 rounded-2xl">
      <div className="flex flex-row gap-1 bg-red-800 px-3 dark:hover:bg-muted transition-all py-1 rounded-sm text-neutral-50 items-center justify-center">
      <Spinner />
      <span className="text-sm">Creazione configurazioni iniziali</span>
      </div>
    </div>
    )
  }

  return (
    <div className="flex flex-col p-5 rounded-b-lg flex-1 gap-5">
      <div className="flex flex-row items-center justify-end">
        <UpdateSettingsHoreca 
          idHoreca={idhoreca}
          initialSettings={hs}/>
      </div>
      <div className="flex flex-col p-5 rounded-lg bg-white flex-1 gap-5 overflow-auto">
        {/* COVER */}
        <div className="aspect-16/4 rounded-[4rem]" style={theme.cover} />
        {/* LOGO + NOME */}
        <div className="flex flex-row lg:h-30 h-20 rounded-[4rem] p-3" style={theme.header} >
          <div className="aspect-square rounded-full" style={theme.logo} />
          <div className="flex flex-col flex-1 p-5 items-start justify-center ">
            <h2 className="text-2xl font-bold">{horeca.nome}</h2>
            <h3 className="text-xs font-semibold italic">@{horeca.alias}</h3>
            <Separator className={`my-1 border`}/>
            <p className="text-xs">{indirizzo}</p>
            <div className="flex flex-row items-start justify-center ">
              social icon
            </div>
          </div>
        </div>
        {hs.maps &&
        <div className="">
          <GoogleMaps address={`${indirizzo}`}/>
        </div>
        }
      </div>
    </div>
  );

}