import { NextResponse } from "next/server";
import { syncStripeSubscription } from "@/lib/stripe/subscription";
import { stripe } from "@/lib/stripe/client";
import { registraPagamento } from "@/lib/stripe/payment";


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
        const session = event.data.object

        if (
          session.mode === "subscription" &&
          session.subscription
        ) {
          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;

          console.log(`Checkout completato: sincronizzo ${subscriptionId}`);    

          await syncStripeSubscription( subscriptionId )
        }

        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        console.log( `Sincronizzazione subscription ${subscription.id} - ${event.type}` );

        await syncStripeSubscription(subscription.id)

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