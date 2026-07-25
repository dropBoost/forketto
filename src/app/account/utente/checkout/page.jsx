import { getPianiAbbonamento } from "./actions/getPianiAbbonamento";
import { creaCheckoutSession } from "./actions/creaCheckoutSession";

export default async function CheckoutPage() {

  const piani = await getPianiAbbonamento();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold">
        Scegli il tuo piano Forketto
      </h1>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {piani.map((piano) => (
          <div key={piano.id} className="rounded-xl border p-6">
            <h2 className="text-xl font-semibold">{piano.nome}</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {piano.descrizione}
            </p>

            <div className="mt-6 text-3xl font-bold">
              € {Number(piano.costo).toFixed(2)}
            </div>

            <form action={creaCheckoutSession} className="mt-6">
              <input type="hidden" name="idPiano" value={piano.id} />

              <button
                type="submit"
                className="w-full rounded-md bg-black px-4 py-2 text-white"
              >
                Abbonati
              </button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}