import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getAbbonamento } from "./actions/getAbbonamento";
import { getRegistroAbbonamenti } from "./actions/getRegistroAbbonamenti";
import { PaymentsTable } from "./components/PaymentsTable";
import { SubscriptionCard } from "./components/SubscriptionCard";

export default async function AbbonamentoPage() {
  const [abbonamento, pagamenti] = await Promise.all([
    getAbbonamento(),
    getRegistroAbbonamenti(),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Abbonamento
        </h1>

        <p className="mt-2 text-muted-foreground">
          Consulta il tuo piano, le date di rinnovo e lo
          storico dei pagamenti.
        </p>
      </div>

      {!abbonamento ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Nessun abbonamento attivo
            </CardTitle>

            <CardDescription>
              Scegli un piano per iniziare a utilizzare tutti
              i servizi Forketto.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button asChild>
              <Link href="/account/utente/checkout">
                Scegli un piano
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <SubscriptionCard
            abbonamento={abbonamento}
          />

          <PaymentsTable pagamenti={pagamenti} />
        </div>
      )}
    </main>
  );
}