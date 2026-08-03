import { getHorecaByAlias } from "@/lib/horeca/getHorecaByAlias";
import { getHorecaThemeByID } from "@/lib/horeca/getHorecaThemeByID";
import { getMenuHorecaByID } from "@/lib/menu/getMenuItemsHorecaByID";
import PageHorecaUI from "@/components/sito/theme/pageHoreca";

export default async function HorecaPAGE({ params }) {

  const { alias } = await params;
  const horeca = await getHorecaByAlias(alias);
  const theme = await getHorecaThemeByID(horeca.id)
  const menu = await getMenuHorecaByID(horeca.id)

  return (
    <div className="flex flex-col p-5 rounded-b-lg flex-1 gap-5 w-full">
      <PageHorecaUI horeca={horeca} theme={theme} menu={menu}/>
    </div>
  );

}