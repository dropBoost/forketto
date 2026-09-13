"use client";

import { useActionState, useState } from "react";
import { creaAbbonamentoManuale } from "../actions/creaAbbonamentoManuale";

const initialState = {
  success: false,
  message: "",
};

export default function FormCreaAbbonamentoManuale({
  piani,
  clienti,
}) {
  const [modalita, setModalita] = useState("nuovo");

  const [state, formAction, pending] = useActionState(
    creaAbbonamentoManuale,
    initialState
  );

  return (
    <form
      action={formAction}
      className="grid gap-5 rounded-xl border p-6"
    >
      <div>
        <h2 className="text-xl font-semibold">
          Crea abbonamento manuale
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          L'abbonamento resterà in attesa fino alla
          registrazione del primo pagamento.
        </p>
      </div>

      <label className="grid gap-2">
        Cliente
        <select
          name="modalita"
          value={modalita}
          onChange={(event) =>
            setModalita(event.target.value)
          }
          className="rounded-md border bg-background p-2"
        >
          <option value="nuovo">
            Crea un nuovo cliente
          </option>
          <option value="esistente">
            Usa un cliente esistente
          </option>
        </select>
      </label>

      {modalita === "esistente" ? (
        <label className="grid gap-2">
          Seleziona cliente
          <select
            name="clienteEsistenteId"
            required
            defaultValue=""
            className="rounded-md border bg-background p-2"
          >
            <option value="" disabled>
              Seleziona un cliente
            </option>

            {clienti.map((cliente) => (
              <option
                key={cliente.id}
                value={cliente.id}
              >
                {cliente.nome} {cliente.cognome} —
                {cliente.email}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            Nome
            <input
              name="nome"
              required
              className="rounded-md border bg-background p-2"
            />
          </label>

          <label className="grid gap-2">
            Cognome
            <input
              name="cognome"
              required
              className="rounded-md border bg-background p-2"
            />
          </label>

          <label className="grid gap-2 sm:col-span-2">
            Email
            <input
              name="email"
              type="email"
              required
              className="rounded-md border bg-background p-2"
            />
          </label>

          <label className="grid gap-2 sm:col-span-2">
            Telefono
            <input
              name="telefono"
              type="tel"
              className="rounded-md border bg-background p-2"
            />
          </label>
        </div>
      )}

      <label className="grid gap-2">
        Piano di abbonamento
        <select
          name="pianoId"
          required
          defaultValue=""
          className="rounded-md border bg-background p-2"
        >
          <option value="" disabled>
            Seleziona un piano
          </option>

          {piani.map((piano) => (
            <option
              key={piano.id}
              value={piano.id}
            >
              {piano.nome} — € {piano.costo}
            </option>
          ))}
        </select>
      </label>

      {state.message && (
        <p
          role={state.success ? "status" : "alert"}
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
        disabled={pending}
        className="rounded-md bg-primary px-4 py-3 text-primary-foreground disabled:opacity-50"
      >
        {pending
          ? "Creazione..."
          : "Crea abbonamento in attesa"}
      </button>
    </form>
  );
}