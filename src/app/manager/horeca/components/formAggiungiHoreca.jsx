"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Store, Plus, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { creaHorecaAction } from "../actions/creaHoreca";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { verificaAliasHorecaAction } from "../actions/verificaAliasHorecaAction";

const initialState = {
  success: false,
  message: "",
  errors: {},
  values: {},
};

function FieldError({ errors }) {
  if (!errors?.length) return null;

  return (
    <p className="text-sm font-medium text-destructive">
      {errors[0]}
    </p>
  );
}

export default function FormHoreca() {

  const formRef = useRef(null);
  const [alias, setAlias] = useState("");
  const [aliasStatus, setAliasStatus] = useState({
    verificato: false,
    disponibile: false,
    message: "",
  });
  const [isCheckingAlias, startAliasTransition] = useTransition();
  const aliasRequestRef = useRef(0);

  const [state, formAction, pending] = useActionState(
    creaHorecaAction,
    initialState
  );

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);

      formRef.current?.reset();
      setAlias("");

      setAliasStatus({
        verificato: false,
        disponibile: false,
        message: "",
      });

      return;
    }

    toast.error(state.message);
  }, [state]);

  useEffect(() => {
    const aliasNormalizzato = alias
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    if (aliasNormalizzato.length < 2) {
      aliasRequestRef.current += 1;

      setAliasStatus({
        verificato: false,
        disponibile: false,
        message: "",
      });

      return;
    }

    const requestId = ++aliasRequestRef.current;

    const timeout = setTimeout(() => {
      startAliasTransition(async () => {
        const result =
          await verificaAliasHorecaAction(aliasNormalizzato);

        if (requestId !== aliasRequestRef.current) {
          return;
        }

        setAliasStatus({
          verificato: true,
          disponibile: result.disponibile,
          message: result.message,
        });
      });
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [alias]);

  return (
    <Dialog className={`max-h-screen`}>
    <DialogTrigger className="flex flex-col gap-2 items-center justify-center bg-primary/20 p-8 rounded-2xl">
      <div className="flex flex-row gap-1 bg-red-800 px-3 dark:hover:bg-muted transition-all py-1 rounded-sm text-neutral-50 items-center justify-center">
      <Plus/>
      <span className="text-sm">Aggiungi</span>
      </div>
      <CardDescription>Aggiungi la tua prima attività</CardDescription>
    </DialogTrigger>
    <DialogContent showCloseButton={false}>
      <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Store className="size-5" />
            </div>
            <div>
            <DialogTitle>
              Nuova attività Horeca
            </DialogTitle>
            <DialogDescription>
              Inserisci i dati dell'attività associata al tuo account.
            </DialogDescription>
            </div>
          </div>
      </DialogHeader>
      <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4">
        <div className="border rounded-2xl p-4 w-full">
          <CardContent>
            <form ref={formRef} action={formAction} className="space-y-4" id="form-horeca">
              {/* MESSAGGI */}
              {!state.success && state.message && (
                <Alert variant="destructive">
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}
              {/* NOME ATTIVITA E ALIAS */}
              <div className="space-y-5">
                <div className="grid gap-3 bg-primary/10 p-4 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="nome">
                      Nome attività
                      <span className="text-destructive">*</span>
                    </Label>

                    <Input
                      id="nome"
                      name="nome"
                      placeholder="Es. Ristorante Da Mario"
                      defaultValue={state.values?.nome ?? ""}
                      aria-invalid={Boolean(state.errors?.nome)}
                      disabled={pending}
                    />

                    <FieldError errors={state.errors?.nome} />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="alias">
                      Alias
                      <span className="text-destructive">*</span>
                    </Label>

                    <div className="relative">
                      <Input
                        id="alias"
                        name="alias"
                        placeholder="ristorante-da-mario"
                        value={alias}
                        onChange={(event) => {
                          const valoreNormalizzato = event.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^a-z0-9_-]/g, "");

                          setAlias(valoreNormalizzato);

                          setAliasStatus({
                            verificato: false,
                            disponibile: false,
                            message: "",
                          });
                        }}
                        aria-invalid={
                          Boolean(state.errors?.alias) ||
                          (
                            aliasStatus.verificato &&
                            !aliasStatus.disponibile
                          )
                        }
                        disabled={pending}
                        className="pr-10"
                      />

                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isCheckingAlias && (
                          <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        )}

                        {!isCheckingAlias &&
                          aliasStatus.verificato &&
                          aliasStatus.disponibile && (
                            <CheckCircle2 className="size-4 text-green-600" />
                          )}

                        {!isCheckingAlias &&
                          aliasStatus.verificato &&
                          !aliasStatus.disponibile && (
                            <XCircle className="size-4 text-destructive" />
                          )}
                      </div>
                    </div>

                    {isCheckingAlias && (
                      <p className="text-xs text-muted-foreground">
                        Controllo disponibilità...
                      </p>
                    )}

                    {!isCheckingAlias && aliasStatus.verificato && (
                      <p
                        className={
                          aliasStatus.disponibile
                            ? "text-xs font-medium text-green-600"
                            : "text-xs font-medium text-destructive"
                        }
                      >
                        {aliasStatus.message}
                      </p>
                    )}

                    {!isCheckingAlias &&
                      !aliasStatus.verificato &&
                      !state.errors?.alias && (
                        <p className="text-xs text-muted-foreground">
                          Utilizza lettere minuscole, numeri e trattini.
                        </p>
                      )}

                    <FieldError errors={state.errors?.alias} />
                  </div>
                </div>
              </div>
              {/* DATI */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold">
                    Indirizzo
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Indica la sede principale dell'attività.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-4 grid-cols-4 ">
                  <div className="space-y-2 md:col-span-3 col-span-3">
                    <Label htmlFor="indirizzo">
                      Indirizzo
                      <span className="text-destructive">*</span>
                    </Label>

                    <Input
                      id="indirizzo"
                      name="indirizzo"
                      placeholder="Via Roma"
                      defaultValue={state.values?.indirizzo ?? ""}
                      aria-invalid={Boolean(state.errors?.indirizzo)}
                      disabled={pending}
                    />

                    <FieldError errors={state.errors?.indirizzo} />
                  </div>

                  <div className="space-y-2 md:col-span-1 col-span-1">
                    <Label htmlFor="civico">
                      N°
                      <span className="text-destructive">*</span>
                    </Label>

                    <Input
                      id="civico"
                      name="civico"
                      placeholder="25"
                      defaultValue={state.values?.civico ?? ""}
                      aria-invalid={Boolean(state.errors?.civico)}
                      disabled={pending}
                    />

                    <FieldError errors={state.errors?.civico} />
                  </div>

                  <div className="space-y-2 md:col-span-1 col-span-1">
                    <Label htmlFor="cap">
                      CAP
                      <span className="text-destructive">*</span>
                    </Label>

                    <Input
                      id="cap"
                      name="cap"
                      inputMode="numeric"
                      maxLength={5}
                      placeholder="80100"
                      defaultValue={state.values?.cap ?? ""}
                      aria-invalid={Boolean(state.errors?.cap)}
                      disabled={pending}
                    />

                    <FieldError errors={state.errors?.cap} />
                  </div>

                  <div className="space-y-2 md:col-span-2 col-span-2">
                    <Label htmlFor="citta">
                      Città
                      <span className="text-destructive">*</span>
                    </Label>

                    <Input
                      id="citta"
                      name="citta"
                      placeholder="Napoli"
                      defaultValue={state.values?.citta ?? ""}
                      aria-invalid={Boolean(state.errors?.citta)}
                      disabled={pending}
                    />

                    <FieldError errors={state.errors?.citta} />
                  </div>

                  <div className="space-y-2 md:col-span-1 col-span-1">
                    <Label htmlFor="provincia">Provincia</Label>

                    <Input
                      id="provincia"
                      name="provincia"
                      placeholder="NA"
                      defaultValue={state.values?.provincia ?? ""}
                      aria-invalid={Boolean(state.errors?.provincia)}
                      disabled={pending}
                    />

                    <FieldError errors={state.errors?.provincia} />
                  </div>
                </div>
              </div>
              {/* ATTIVA */}
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="attivo"
                    name="attivo"
                    defaultChecked={
                      state.values?.attivo === undefined
                        ? true
                        : state.values.attivo
                    }
                    disabled={pending}
                  />

                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="attivo"
                      className="cursor-pointer font-medium"
                    >
                      Attività attiva
                    </Label>

                    <p className="text-xs text-muted-foreground">
                      L'attività sarà immediatamente disponibile all'interno
                      della piattaforma.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" 
        disabled={ pending || isCheckingAlias || !aliasStatus.verificato || !aliasStatus.disponibile} 
        className="min-w-40" form="form-horeca">

          {pending ? (
            <>
              <Loader2 className="animate-spin" />
              Salvataggio...
            </>
          ) : (
            <div className="flex flex-row items-center gap-1 justify-center">
            <Plus/> Crea attività
            </div>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
    </Dialog>
  );
}