import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

import FormCreaAbbonamentoManuale from "./components/FormCreaAbbonamentoManuale";
import FormRegistraPagamentoManuale from "./components/FormRegistraPagamentoManuale";

export default async function PageAbbonamenti() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Devi effettuare l'accesso.");
  }

  const { data: operatore, error: operatoreError } =
    await supabaseAdmin
      .from("utente")
      .select("ruolo, attivo")
      .eq("id", user.id)
      .maybeSingle();

  if (
    operatoreError ||
    !operatore ||
    !operatore.attivo ||
    operatore.ruolo !== "HRC"
  ) {
    throw new Error("Accesso non consentito.");
  }

  const [pianiResult, clientiResult, abbonamentiResult, pendingResult] =
    await Promise.all([
      supabaseAdmin
        .from("piano_abbonamento")
        .select("id, nome, costo")
        .eq("attivo", true)
        .order("costo"),

      supabaseAdmin
        .from("utente")
        .select("id, nome, cognome, email")
        .eq("ruolo", "HRC")
        .eq("attivo", true)
        .order("email"),

      supabaseAdmin
        .from("abbonamento")
        .select(`
          id,
          utente,
          status,
          origine,
          data_scadenza_manuale,
          cliente:utente!abbonamento_utente_fkey(
            id,
            nome,
            cognome,
            email
          ),
          piano:piano_abbonamento!abbonamento_id_piano_abbonamento_fkey(
            id,
            nome,
            costo
          )
        `)
        .eq("origine", "manuale")
        .order("created_at", {
          ascending: false,
        }),

      supabaseAdmin
        .from("registro_abbonamento")
        .select(`
          id,
          utente,
          status,
          costo,
          manual_operation_id,
          data_scadenza_manuale
        `)
        .eq("origine", "manuale")
        .eq("status", "pending"),
    ]);

  const errore = [
    pianiResult.error,
    clientiResult.error,
    abbonamentiResult.error,
    pendingResult.error,
  ].find(Boolean);

  if (errore) {
    throw new Error(errore.message);
  }

  const piani = pianiResult.data ?? [];
  const clienti = clientiResult.data ?? [];
  const abbonamenti =
    abbonamentiResult.data ?? [];
  const pagamentiPending =
    pendingResult.data ?? [];

  return (
    <main className="w-full space-y-8 p-4">
      <div>
        <h1 className="text-2xl font-bold">
          Abbonamenti manuali
        </h1>
        <p className="text-muted-foreground">
          Crea l'abbonamento e registra il
          pagamento quando lo ricevi.
        </p>
      </div>

      <FormCreaAbbonamentoManuale
        piani={piani}
        clienti={clienti}
      />

      <section className="space-y-5">
        <h2 className="text-xl font-semibold">
          Abbonamenti creati
        </h2>

        {abbonamenti.length === 0 && (
          <p>Nessun abbonamento manuale.</p>
        )}

        {abbonamenti.map(
          (abbonamento) => {
            const sospesi =
              pagamentiPending.filter(
                (pagamento) =>
                  pagamento.utente ===
                  abbonamento.utente
              );

            return (
              <div
                key={abbonamento.id}
                className="space-y-4 rounded-xl border p-5"
              >
                <div>
                  <h3 className="font-semibold">
                    {
                      abbonamento.cliente
                        ?.nome
                    }{" "}
                    {
                      abbonamento.cliente
                        ?.cognome
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {
                      abbonamento.cliente
                        ?.email
                    }{" "}
                    ·{" "}
                    {
                      abbonamento.piano
                        ?.nome
                    }{" "}
                    ·{" "}
                    {abbonamento.status}
                  </p>
                </div>

                {sospesi.length > 0
                  ? sospesi.map(
                      (pagamento) => (
                        <FormRegistraPagamentoManuale
                          key={
                            pagamento.id
                          }
                          abbonamento={
                            abbonamento
                          }
                          pagamentoPending={
                            pagamento
                          }
                        />
                      )
                    )
                  : (
                    <FormRegistraPagamentoManuale
                      abbonamento={
                        abbonamento
                      }
                    />
                  )}
              </div>
            );
          }
        )}
      </section>
    </main>
  );
}