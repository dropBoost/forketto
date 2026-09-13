import { getUtente } from "@/lib/auth/getUtente";

export default async function PageABBONAMENTI() {

  const utente = await getUtente();
  const horeca = utente?.horeca

  return (
  <div className="@container/main flex flex-1 flex-col p-4">
    <div className="flex flex-col gap-2">
     ciao
    </div>
  </div>
  );
}
 