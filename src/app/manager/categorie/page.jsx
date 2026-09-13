import { getMenuCategorie } from "@/lib/menu/getMenuCategorie";
import { getMenuSupercategorie } from "@/lib/menu/getMenuSupercategorie";
import ListaMenu from "./components/ListaCategorie";
import { getUtente } from "@/lib/auth/getUtente";
import { getMenuCategorieUtenteByID } from "@/lib/menu/getMenuCategorieUtenteByID";
import ListaCategorie from "./components/ListaCategorie";

export default async function PageCATEGORIE() {

  const utente = await getUtente();
  const horeca = utente?.horeca
  const categorie = await getMenuCategorie();
  const supercategorie = await getMenuSupercategorie();

  return (
  <div className="@container/main flex flex-1 flex-col p-4 gap-2">
    <div className="flex-1 p-0 overflow-y-auto mb-2">
      <ListaCategorie supercategorie={supercategorie} horeca={horeca}/>
    </div>
  </div>
  );

}
