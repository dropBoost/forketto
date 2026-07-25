import { stripe } from "@/lib/stripe/client";

export async function getOrCreateStripeCustomer(
  supabase,
  user
) {
  const { data: utente, error } = await supabase
    .from("utente")
    .select(
      "id, nome, cognome, email, stripe_customer_id"
    )
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(
      `Errore recupero utente: ${error.message}`
    );
  }

  if (!utente) {
    throw new Error("Utente non trovato");
  }

  if (utente.stripe_customer_id) {
    return utente.stripe_customer_id;
  }

  const nomeCompleto = [
    utente.nome,
    utente.cognome,
  ]
    .filter(Boolean)
    .join(" ");

  const customer = await stripe.customers.create({
    email: utente.email || user.email,
    name: nomeCompleto || undefined,
    metadata: {
      utente: user.id,
    },
  });

  const { error: updateError } = await supabase
    .from("utente")
    .update({
      stripe_customer_id: customer.id,
    })
    .eq("id", user.id);

  if (updateError) {
    throw new Error(
      `Errore salvataggio Stripe Customer: ${updateError.message}`
    );
  }

  return customer.id;
}