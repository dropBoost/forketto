import { getMenuCategorie } from "@/lib/menu/getMenuCategorie";
import ListaMenu from "./components/ListaMenu";
import { getUtente } from "@/lib/auth/getUtente";

export default async function PageMENU() {

  const utente = await getUtente();
  const horeca = utente?.horeca

  const categorie = await getMenuCategorie();

  return (
  <div className="@container/main flex flex-1 flex-col p-4 gap-2">
    {/* ELENCO ELEMENTI MENU */}
    <div className="flex-1 p-0 overflow-y-auto mb-2">
      <ListaMenu categorie={categorie} horeca={horeca}/>
    </div>
  </div>
  );

}
