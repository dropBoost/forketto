import { FormAccessoUtente } from "@/app/account/utente/accesso/form-accesso-utente"
import { getUtenteLoggato } from "@/utils/auth/getUtenteLoggato";
import { redirect } from "next/navigation";

export default async function LoginPage() {

  const utente = await getUtenteLoggato()

  if (utente && utente?.utente.ruolo == "HRC") {
    redirect(`/manager`)
  }

  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 w-full bg-primary">
      <div className="w-full max-w-sm md:max-w-4xl">
        <FormAccessoUtente />
      </div>
    </div>
  );
}
