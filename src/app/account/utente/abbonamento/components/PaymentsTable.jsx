import { ExternalLink, FileDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatCurrency(value) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(Number(value ?? 0));
}

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function PaymentsTable({ pagamenti }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Storico pagamenti</CardTitle>

        <CardDescription>
          Consulta i pagamenti relativi al tuo abbonamento
          Forketto.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {pagamenti.length === 0 ? (
          <div className="rounded-lg border border-dashed px-6 py-10 text-center">
            <p className="font-medium">
              Nessun pagamento disponibile
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              I pagamenti completati compariranno qui.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Piano</TableHead>
                  <TableHead>Importo</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-right">
                    Fattura
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pagamenti.map((pagamento) => (
                  <TableRow key={pagamento.id}>
                    <TableCell className="font-medium">
                      {formatDate(pagamento.data_pagamento)}
                    </TableCell>

                    <TableCell>
                      {pagamento.piano_abbonamento?.nome ??
                        "Piano Forketto"}
                    </TableCell>

                    <TableCell>
                      {formatCurrency(pagamento.costo)}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 text-emerald-700"
                      >
                        Pagata
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {pagamento.stripe_invoice_pdf && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a
                              href={pagamento.stripe_invoice_pdf}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <FileDown />
                              PDF
                            </a>
                          </Button>
                        )}

                        {pagamento.stripe_invoice_hosted_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <a
                              href={
                                pagamento.stripe_invoice_hosted_url
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <ExternalLink />
                              Visualizza
                            </a>
                          </Button>
                        )}

                        {!pagamento.stripe_invoice_pdf &&
                          !pagamento.stripe_invoice_hosted_url && (
                            <span className="text-sm text-muted-foreground">
                              Non disponibile
                            </span>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}