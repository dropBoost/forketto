import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe/client";
import { supabaseAdmin } from "@/utils/supabase/admin";

/**
 * Converte un timestamp Unix Stripe in ISO.
 */
function timestampToIso(timestamp) {
  if (!timestamp) return null;

  return new Date(timestamp * 1000).toISOString();
}

/**
 * Recupera l'ID della subscription da una fattura.
 *
 * Manteniamo entrambi i percorsi per essere compatibili
 * con differenti versioni dell'API Stripe.
 */
function getInvoiceSubscriptionId(invoice) {
  return (
    invoice.parent?.subscription_details?.subscription ??
    invoice.subscription ??
    null
  );
}

/**
 * Recupera il Price ID dalla prima riga della fattura.
 */
function getInvoicePriceId(invoice) {
  const line = invoice.lines?.data?.[0];

  return (
    line?.pricing?.price_details?.price ??
    line?.price?.id ??
    null
  );
}

/**
 * Recupera i dati del periodo dalla prima voce
 * dell'abbonamento.
 *
 * Nelle versioni Stripe recenti il periodo è associato
 * al subscription item.
 */
function getSubscriptionPeriod(subscription) {
  const item = subscription.items?.data?.[0];

  return {
    currentPeriodStart:
      item?.current_period_start ??
      subscription.current_period_start ??
      null,

    currentPeriodEnd:
      item?.current_period_end ??
      subscription.current_period_end ??
      null,
  };
}

/**
 * Crea o aggiorna lo stato attuale dell'abbonamento.
 */
async function sincronizzaAbbonamento(subscription) {
  const utente = subscription.metadata?.utente;
  const idPianoMetadata =
    subscription.metadata?.id_piano_abbonamento;

  const item = subscription.items?.data?.[0];
  const stripePriceId = item?.price?.id ?? null;

  if (!utente) {
    throw new Error(
      `Metadata utente mancante nella subscription ${subscription.id}`
    );
  }

  let idPianoAbbonamento = idPianoMetadata;

  /*
   * Se il metadata del piano non fosse disponibile,
   * recuperiamo il piano tramite stripe_price_id.
   */
  if (!idPianoAbbonamento && stripePriceId) {
    const { data: piano, error: pianoError } =
      await supabaseAdmin
        .from("piano_abbonamento")
        .select("id")
        .eq("stripe_price_id", stripePriceId)
        .single();

    if (pianoError || !piano) {
      throw new Error(
        `Piano non trovato per Stripe Price ${stripePriceId}`
      );
    }

    idPianoAbbonamento = piano.id;
  }

  if (!idPianoAbbonamento) {
    throw new Error(
      `Piano mancante nella subscription ${subscription.id}`
    );
  }

  const { currentPeriodStart, currentPeriodEnd } =
    getSubscriptionPeriod(subscription);

  const datiAbbonamento = {
    utente,
    id_piano_abbonamento: idPianoAbbonamento,
    stripe_customer_id:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id,
    stripe_subscription_id: subscription.id,
    stripe_price_id: stripePriceId,
    status: subscription.status,
    current_period_start: timestampToIso(currentPeriodStart),
    current_period_end: timestampToIso(currentPeriodEnd),
    cancel_at_period_end:
      subscription.cancel_at_period_end ?? false,
    canceled_at: timestampToIso(subscription.canceled_at),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from("abbonamento")
    .upsert(datiAbbonamento, {
      onConflict: "utente",
    });

  if (error) {
    throw new Error(
      `Errore sincronizzazione abbonamento: ${error.message}`
    );
  }

  console.log(
    `Abbonamento sincronizzato: ${subscription.id} - ${subscription.status}`
  );
}

/**
 * Registra una fattura pagata nello storico.
 */
async function registraPagamento(invoice) {
  const stripeSubscriptionId =
    getInvoiceSubscriptionId(invoice);

  if (!stripeSubscriptionId) {
    console.log(
      `Fattura ${invoice.id} ignorata: non appartiene a una subscription`
    );

    return;
  }

  /*
   * Recuperiamo la subscription direttamente da Stripe,
   * così abbiamo metadata e utente affidabili.
   */
  const subscription = await stripe.subscriptions.retrieve(
    stripeSubscriptionId
  );

  const utente = subscription.metadata?.utente;
  let idPianoAbbonamento =
    subscription.metadata?.id_piano_abbonamento;

  const stripePriceId =
    getInvoicePriceId(invoice) ??
    subscription.items?.data?.[0]?.price?.id ??
    null;

  if (!utente) {
    throw new Error(
      `Metadata utente mancante nella subscription ${subscription.id}`
    );
  }

  let piano = null;

  if (idPianoAbbonamento) {
    const { data, error } = await supabaseAdmin
      .from("piano_abbonamento")
      .select("id, durata, costo")
      .eq("id", idPianoAbbonamento)
      .single();

    if (error) {
      throw new Error(
        `Errore recupero piano: ${error.message}`
      );
    }

    piano = data;
  } else if (stripePriceId) {
    const { data, error } = await supabaseAdmin
      .from("piano_abbonamento")
      .select("id, durata, costo")
      .eq("stripe_price_id", stripePriceId)
      .single();

    if (error) {
      throw new Error(
        `Errore recupero piano tramite Price ID: ${error.message}`
      );
    }

    piano = data;
    idPianoAbbonamento = data.id;
  }

  if (!piano) {
    throw new Error(
      `Piano non trovato per la fattura ${invoice.id}`
    );
  }

  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;

  /*
   * amount_paid è espresso nell'unità minima:
   * 1900 = 19,00 euro.
   */
  const costoPagato =
    typeof invoice.amount_paid === "number"
      ? invoice.amount_paid / 100
      : piano.costo;

  const dataPagamento = timestampToIso(
    invoice.status_transitions?.paid_at ??
      invoice.created
  );

  const { error } = await supabaseAdmin
  .from("registro_abbonamento")
  .upsert(
    {
      id_piano_abbonamento: idPianoAbbonamento,
      utente,
      data_pagamento: dataPagamento
        ? dataPagamento.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      durata: piano.durata,
      costo: costoPagato,
      stripe_customer_id: customerId,
      stripe_subscription_id: stripeSubscriptionId,
      stripe_invoice_id: invoice.id,
      stripe_invoice_pdf: invoice.invoice_pdf ?? null,
      stripe_invoice_hosted_url:
        invoice.hosted_invoice_url ?? null,
    },
    {
      onConflict: "stripe_invoice_id",
    }
  );

  if (error) {
    throw new Error(
      `Errore registrazione pagamento: ${error.message}`
    );
  }

  console.log(`Pagamento registrato: ${invoice.id}`);
}

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    return NextResponse.json(
      { error: "Header stripe-signature mancante" },
      { status: 400 }
    );
  }

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET non configurata" },
      { status: 500 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error(
      "Firma webhook non valida:",
      error.message
    );

    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  console.log(`Evento Stripe ricevuto: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        if (
          session.mode === "subscription" &&
          session.subscription
        ) {
          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;

          const subscription =
            await stripe.subscriptions.retrieve(
              subscriptionId
            );

          await sincronizzaAbbonamento(subscription);
        }

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        await sincronizzaAbbonamento(subscription);

        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;

        await registraPagamento(invoice);

        break;
      }

      default:
        console.log(`Evento ignorato: ${event.type}`);
    }

    return NextResponse.json({
      received: true,
      type: event.type,
    });
  } catch (error) {
    console.error(
      `Errore gestione evento ${event.type}:`,
      error
    );

    return NextResponse.json(
      {
        received: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}