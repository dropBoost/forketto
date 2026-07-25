import Link from "next/link";
import { getRegistroAbbonamenti } from "../../abbonamento/actions/getRegistroAbbonamenti";

export default function CheckoutReturnPage() {

  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold">
        Pagamento completato
      </h1>

      <p className="mt-4 text-muted-foreground">
        Il tuo abbonamento è stato ricevuto. A breve Forketto sarà aggiornato.
      </p>

      <Link
        href="/manager"
        className="mt-8 inline-block rounded-md bg-black px-5 py-3 text-white"
      >
        Vai alla tua area
      </Link>
    </main>
  );

}