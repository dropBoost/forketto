"use client";

import {
  useActionState,
  useEffect,
  useState,
} from "react";

import { registraPagamentoManuale } from "../actions/registraPagamentoManuale";

const initialState = {
  success: false,
  message: "",
};

export default function FormRegistraPagamentoManuale({
  abbonamento,
  pagamentoPending = null,
}) {
  const [operazioneId, setOperazioneId] =
    useState("");

  const [state, formAction, pending] =
    useActionState(
      registraPagamentoManuale,
      initialState
    );

  useEffect(() => {
    setOperazioneId(crypto.randomUUID());
  }, []);

  const idDaInviare =
    pagamentoPending?.manual_operation_id ||
    operazioneId;

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-lg border p-4"
    >
      <input
        type="hidden"
        name="abbonamentoId"
        value={abbonamento.id}
      />

      <input
        type="hidden"
        name="operazioneId"
        value={idDaInviare}
      />

      <div>
        <h3 className="font-semibold">
          {pagamentoPending
            ? "Riprendi pagamento interrotto"
            : abbonamento.status ===
                "pending_manual_payment"
              ? "Registra il primo pagamento"
              : "Registra un rinnovo"}
        </h3>

        {abbonamento.data_scadenza_manuale && (
          <p className="text-sm text-muted-foreground">
            Scadenza attuale:{" "}
            {abbonamento.data_scadenza_manuale}
          </p>
        )}
      </div>

      {pagamentoPending ? (
        <p className="text-sm text-amber-700">
          Esiste un'operazione incompleta da
          € {pagamentoPending.costo}, con
          scadenza{" "}
          {
            pagamentoPending.data_scadenza_manuale
          }
          . Usa lo stesso ID per completarla.
        </p>
      ) : (
        <>
          <label className="grid gap-2">
            Importo ricevuto (€)
            <input
              name="importo"
              type="text"
              inputMode="decimal"
              defaultValue={
                abbonamento.piano?.costo ??
                ""
              }
              required
              className="rounded-md border bg-background p-2"
            />
          </label>

          <label className="grid gap-2">
            Data del pagamento
            <input
              name="dataPagamento"
              type="date"
              required
              className="rounded-md border bg-background p-2"
            />
          </label>

          <label className="grid gap-2">
            Ultimo giorno di validità
            <input
              name="dataScadenza"
              type="date"
              required
              className="rounded-md border bg-background p-2"
            />
          </label>

          <label className="grid gap-2">
            Metodo di pagamento
            <select
              name="metodoPagamento"
              required
              defaultValue=""
              className="rounded-md border bg-background p-2"
            >
              <option value="" disabled>
                Seleziona
              </option>
              <option value="bonifico">
                Bonifico
              </option>
              <option value="contanti">
                Contanti
              </option>
              <option value="pos">POS</option>
              <option value="altro">Altro</option>
            </select>
          </label>

          <label className="grid gap-2">
            Riferimento (facoltativo)
            <input
              name="riferimentoPagamento"
              className="rounded-md border bg-background p-2"
            />
          </label>
        </>
      )}

      {state.message && (
        <p
          role={
            state.success
              ? "status"
              : "alert"
          }
          className={
            state.success
              ? "text-sm text-green-700"
              : "text-sm text-red-600"
          }
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={
          pending ||
          !idDaInviare ||
          state.success
        }
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
      >
        {pending
          ? "Registrazione..."
          : pagamentoPending
            ? "Completa operazione"
            : "Registra pagamento"}
      </button>
    </form>
  );
}