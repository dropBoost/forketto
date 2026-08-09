import { getHorecaByAlias } from "@/lib/horeca/getHorecaByAlias";
import { getHorecaThemeByID } from "@/lib/horeca/getHorecaThemeByID";
import { getMenuHorecaByID } from "@/lib/menu/getMenuItemsHorecaByID";
import PageHorecaUI from "@/components/sito/theme/pageHoreca";
import Image from "next/image";
import Link from "next/link";

export default async function HorecaPAGE({ params }) {

  const { alias } = await params;
  const horeca = await getHorecaByAlias(alias);
  const theme = await getHorecaThemeByID(horeca.id)
  const menu = await getMenuHorecaByID(horeca.id)

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full min-h-dvh bg-neutral-100">
      <div className="flex-1 w-full">
        <PageHorecaUI horeca={horeca} theme={theme} menu={menu}/>
      </div>
      <div className="flex flex-row items-center justify-between bg-neutral-800 w-full p-5 px-7 max-w-7xl">
        <Image src="/assets/img/logo_forketto.png" width={80} height={30}/>
        <Link href={`https://www.dropboost.it`} target="_blank" className="text-[0.6rem] text-secondary">powered by dropboost.it</Link>
      </div>
    </div>
  );

}