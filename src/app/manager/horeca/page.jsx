import { getUtente } from "@/lib/auth/getUtente";
import FormHoreca from "./components/formAggiungiHoreca";
import ElencoHoreca from "./components/elencoHoreca";

export default async function PageHORECA() {

  const utente = await getUtente();
  const horeca = utente?.horeca

  return (
  <div className="@container/main flex flex-1 flex-col p-4">
    {horeca.length > 0 ?
    <div className="flex flex-col gap-2">
      <ElencoHoreca horeca={horeca}/>
    </div> : 
    <div className="flex flex-1 flex-col items-center justify-center">
      <FormHoreca/>
    </div> }
  </div>
  );
}
 