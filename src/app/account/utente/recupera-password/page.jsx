import Link from "next/link";

import { richiediRecuperoPassword } from
  "../actions/password";

const messaggiErrore = {
  email: "Inserisci un indirizzo email valido.",
  invio:
    "Non è stato possibile inviare l'email. Riprova più tardi.",
  link:
    "Il link non è valido o è scaduto. Richiedine uno nuovo.",
  sessione:
    "La sessione è scaduta. Richiedi un nuovo link.",
};

export default async function RecuperaPasswordPage({
  searchParams,
}) {
  const params = await searchParams;
  const inviata = params?.inviata === "1";

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <h1 className="text-2xl font-bold">
          Imposta o recupera la password
        </h1>

        {inviata ? (
          <div className="mt-5 space-y-4">
            <p className="text-sm">
              Se l’indirizzo è associato a un account,
              riceverai un’email con il link per impostare
              la password. Controlla anche la cartella spam.
            </p>

            <Link
              href="/account/utente/accesso"
              className="inline-block font-medium underline"
            >
              Torna all’accesso
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Inserisci l’email del tuo account Forketto.
              Ti invieremo un link personale.
            </p>

            {messaggiErrore[params?.error] && (
              <p
                role="alert"
                className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {messaggiErrore[params.error]}
              </p>
            )}

            <form
              action={richiediRecuperoPassword}
              className="mt-6 space-y-4"
            >
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-md border bg-background px-3 py-2"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground"
              >
                Invia il link
              </button>
            </form>

            <Link
              href="/account/utente/accesso"
              className="mt-5 inline-block text-sm underline"
            >
              Torna all’accesso
            </Link>
          </>
        )}
      </div>
    </main>
  );
}