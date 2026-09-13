import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import { impostaPassword } from
  "../actions/password";

const messaggiErrore = {
  lunghezza:
    "La password deve contenere almeno 12 caratteri.",
  conferma:
    "Le due password non coincidono.",
  salvataggio:
    "Non sono riuscito a salvare la password. Riprova.",
};

export default async function ImpostaPasswordPage({
  searchParams,
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <h1 className="text-2xl font-bold">
          Imposta la tua password
        </h1>

        {!user ? (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-muted-foreground">
              Il link non è valido oppure la sessione è
              scaduta. Richiedi un nuovo link per impostare
              la password.
            </p>

            <Link
              href="/account/utente/recupera-password"
              className="inline-block font-medium underline"
            >
              Richiedi un nuovo link
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Account: {user.email}. Scegli una password
              personale per accedere a Forketto.
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
              action={impostaPassword}
              className="mt-6 space-y-4"
            >
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium"
                >
                  Nuova password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  required
                  className="w-full rounded-md border bg-background px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confermaPassword"
                  className="block text-sm font-medium"
                >
                  Conferma password
                </label>

                <input
                  id="confermaPassword"
                  name="confermaPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={12}
                  required
                  className="w-full rounded-md border bg-background px-3 py-2"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground"
              >
                Salva password
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}