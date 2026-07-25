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
import { Separator } from "@/components/ui/separator";

import { StatusBadge } from "./StatusBadge";

function formatCurrency(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value ?? 0));
}

function formatDate(value) {
  if (!value) return "Non disponibile";

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function getDurataLabel(durata) {
  const valore = Number(durata);

  if (!Number.isFinite(valore)) {
    return "Non disponibile";
  }

  if (valore === 30) {
    return "Mensile";
  }

  if (valore === 365) {
    return "Annuale";
  }

  return `${valore} giorni`;
}

export function SubscriptionCard({ abbonamento }) {
  const piano = abbonamento.piano_abbonamento;

  const isCanceledAtPeriodEnd =
    abbonamento.cancel_at_period_end === true;

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
          <p className="text-3xl font-bold">
            {formatCurrency(piano?.costo)}
          </p>

          <p className="text-sm text-muted-foreground">
            {getDurataLabel(piano?.durata)}
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

        <div>
          <p className="text-sm text-muted-foreground">
            Periodo corrente
          </p>

          <p className="mt-1 font-medium">
            {formatDate(abbonamento.current_period_start)}
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
            Importo
          </p>

          <p className="mt-1 font-medium">
            {formatCurrency(piano?.costo)}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Durata
          </p>

          <p className="mt-1 font-medium">
            {getDurataLabel(piano?.durata)}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Codice abbonamento
          </p>

          <p className="mt-1 truncate font-mono text-sm">
            {abbonamento.stripe_subscription_id}
          </p>
        </div>

        {isCanceledAtPeriodEnd && (
          <div className="sm:col-span-2 lg:col-span-3">
            <Separator className="mb-6" />

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
              L’abbonamento è stato annullato, ma resterà
              utilizzabile fino al{" "}
              <strong>
                {formatDate(abbonamento.current_period_end)}
              </strong>
              .
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t bg-muted/20 py-4">
        <form action={creaPortalSession}>
          <Button type="submit">
            Gestisci abbonamento
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}