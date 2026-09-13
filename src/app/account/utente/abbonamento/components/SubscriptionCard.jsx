import { creaPortalSession } from "../actions/creaPortalSession";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { StatusBadge } from "./StatusBadge";

function formatCurrency(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value ?? 0));
}

function formatDate(value) {
  if (!value) return "Non disponibile";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Non disponibile";
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(date);
}

function formatManualDate(value) {
  if (!value) return "Da definire dopo il pagamento";

  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function SubscriptionCard({ abbonamento }) {
  const piano = abbonamento.piano_abbonamento;
  const manuale = abbonamento.origine === "manuale";
  const inAttesa =
    manuale &&
    abbonamento.status === "pending_manual_payment";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 bg-muted/40 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <CardDescription>
            Il tuo piano Forketto
          </CardDescription>

          <CardTitle className="text-3xl">
            {piano?.nome ?? "Piano Forketto"}
          </CardTitle>

          <StatusBadge status={abbonamento.status} />
        </div>

        <div className="text-left md:text-right">
          <p className="text-sm text-muted-foreground">
            Prezzo del piano
          </p>
          <p className="text-3xl font-bold">
            {formatCurrency(piano?.costo)}
          </p>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Piano
          </p>
          <p className="mt-1 font-medium">
            {piano?.nome ?? "Non disponibile"}
          </p>
        </div>

        {manuale ? (
          <>
            <div>
              <p className="text-sm text-muted-foreground">
                Scadenza impostata
              </p>
              <p className="mt-1 font-medium">
                {formatManualDate(
                  abbonamento.data_scadenza_manuale
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Modalità
              </p>
              <p className="mt-1 font-medium">
                Gestione manuale
              </p>
            </div>

            {inAttesa && (
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 sm:col-span-2 lg:col-span-3">
                L’accesso al servizio sarà attivato dopo la
                registrazione del pagamento.
              </p>
            )}
          </>
        ) : (
          <>
            <div>
              <p className="text-sm text-muted-foreground">
                Periodo corrente
              </p>
              <p className="mt-1 font-medium">
                {formatDate(
                  abbonamento.current_period_start
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Prossimo rinnovo
              </p>
              <p className="mt-1 font-medium">
                {formatDate(abbonamento.current_period_end)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Codice abbonamento Stripe
              </p>
              <p className="mt-1 truncate font-mono text-sm">
                {abbonamento.stripe_subscription_id ??
                  "Non disponibile"}
              </p>
            </div>

            {abbonamento.cancel_at_period_end === true && (
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 sm:col-span-2 lg:col-span-3">
                L’abbonamento resterà utilizzabile fino al{" "}
                {formatDate(
                  abbonamento.current_period_end
                )}.
              </p>
            )}
          </>
        )}
      </CardContent>

      {!manuale && (
        <CardFooter className="border-t bg-muted/20 py-4">
          <form action={creaPortalSession}>
            <Button type="submit">
              Gestisci abbonamento
            </Button>
          </form>
        </CardFooter>
      )}
    </Card>
  );
}