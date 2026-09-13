import { stripe } from "@/lib/stripe/client"
import { supabaseAdmin } from "@/utils/supabase/admin"

/**
 * Converte un timestamp Unix Stripe in ISO.
 */
function timestampToIso(timestamp) {
  if (!timestamp) return null

  return new Date(timestamp * 1000).toISOString()
}

/**
 * Recupera l'ID della subscription da una fattura.
 */
function getInvoiceSubscriptionId(invoice) {
  return (
    invoice.parent?.subscription_details?.subscription ??
    invoice.subscription ??
    null
  )
}

/**
 * Recupera il Price ID dalla prima riga della fattura.
 */
function getInvoicePriceId(invoice) {
  const line = invoice.lines?.data?.[0]

  return (
    line?.pricing?.price_details?.price ??
    line?.price?.id ??
    null
  )
}

/**
 * Registra una fattura pagata nello storico.
 */
export async function registraPagamento(invoice) {
  const stripeSubscriptionId =
    getInvoiceSubscriptionId(invoice)

  if (!stripeSubscriptionId) {
    console.log(
      `Fattura ${invoice.id} ignorata: non appartiene a una subscription`
    )

    return
  }

  const subscription =
    await stripe.subscriptions.retrieve(
      stripeSubscriptionId
    )

  const utente = subscription.metadata?.utente

  let idPianoAbbonamento =
    subscription.metadata?.id_piano_abbonamento

  const stripePriceId =
    getInvoicePriceId(invoice) ??
    subscription.items?.data?.[0]?.price?.id ??
    null

  if (!utente) {
    throw new Error(
      `Metadata utente mancante nella subscription ${subscription.id}`
    )
  }

  let piano = null

  if (idPianoAbbonamento) {
    const { data, error } = await supabaseAdmin
      .from("piano_abbonamento")
      .select("id, durata, costo")
      .eq("id", idPianoAbbonamento)
      .single()

    if (error) {
      throw new Error(
        `Errore recupero piano: ${error.message}`
      )
    }

    piano = data
  } else if (stripePriceId) {
    const { data, error } = await supabaseAdmin
      .from("piano_abbonamento")
      .select("id, durata, costo")
      .eq("stripe_price_id", stripePriceId)
      .single()

    if (error) {
      throw new Error(
        `Errore recupero piano tramite Price ID: ${error.message}`
      )
    }

    piano = data
    idPianoAbbonamento = data.id
  }

  if (!piano) {
    throw new Error(
      `Piano non trovato per la fattura ${invoice.id}`
    )
  }

  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id

  const costoPagato =
    typeof invoice.amount_paid === "number"
      ? invoice.amount_paid / 100
      : piano.costo

  const dataPagamento = timestampToIso(
    invoice.status_transitions?.paid_at ??
      invoice.created
  )

  const { error } = await supabaseAdmin
    .from("registro_abbonamento")
    .upsert(
      {
        id_piano_abbonamento:
          idPianoAbbonamento,

        utente,

        data_pagamento: dataPagamento
          ? dataPagamento.slice(0, 10)
          : new Date().toISOString().slice(0, 10),

        durata: piano.durata,
        costo: costoPagato,

        stripe_customer_id: customerId,
        stripe_subscription_id:
          stripeSubscriptionId,

        stripe_invoice_id: invoice.id,

        stripe_invoice_pdf:
          invoice.invoice_pdf ?? null,

        stripe_invoice_hosted_url:
          invoice.hosted_invoice_url ?? null,
      },
      {
        onConflict: "stripe_invoice_id",
      }
    )

  if (error) {
    throw new Error(
      `Errore registrazione pagamento: ${error.message}`
    )
  }

  console.log(
    `Pagamento registrato: ${invoice.id}`
  )
}