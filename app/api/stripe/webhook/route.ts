// Importa a instância do Stripe configurada
import stripe from "@/app/lib/stripe";
// Importa as funções para lidar com eventos específicos do Stripe
import { handleStripeCancelSubscription } from "@/app/server/stripe/handle-cancel";
import { handleStripPayment } from "@/app/server/stripe/handle-payment";
import { handleStripeSubscription } from "@/app/server/stripe/handle-subscription";
// Importa funções do Next.js para lidar com cabeçalhos e respostas
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Obtém o segredo do webhook do Stripe a partir das variáveis de ambiente
const secret = process.env.STRIPE_WEBHOOK_SECRET;

// Função que lida com requisições POST enviadas pelo webhook do Stripe
export async function POST(req: NextRequest) {
  try {
    // Lê o corpo da requisição como texto
    const body = await req.text();
    // Obtém os cabeçalhos da requisição
    const headersList = await headers();
    // Obtém a assinatura do Stripe enviada no cabeçalho
    const signature = headersList.get("stripe-signature");

    // Verifica se a assinatura ou o segredo estão ausentes. Caso estejam, retorna um erro.
    if (!signature || !secret) {
      return NextResponse.json(
        { error: "No signature or secret" },
        { status: 400 }
      );
    }

    // Constrói o evento do Stripe usando o corpo, a assinatura e o segredo
    const event = stripe.webhooks.constructEvent(body, signature, secret);

    // Lida com o tipo de evento recebido do Stripe
    switch (event.type) {
      case "checkout.session.completed": // Pagamento realizado com sucesso
        const metadata = event.data.object.metadata; // Obtém os metadados enviados na sessão

        // Verifica se o pagamento foi para um produto único
        if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
          await handleStripPayment(event); // Lida com o pagamento único
        }
        // Verifica se o pagamento foi para uma assinatura
        if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
          await handleStripeSubscription(event); // Lida com a assinatura
        }
        break;

      case "checkout.session.expired": // Sessão de pagamento expirou
        console.log(
          "Enviar um email para o usuário avisando que o pagamento expirou."
        );
        break;

      case "checkout.session.async_payment_succeeded": // Pagamento via boleto realizado com sucesso
        console.log(
          "Enviar um email para o usuário avisando que o pagamento foi realizado"
        );
        break;

      case "checkout.session.async_payment_failed": // Pagamento via boleto falhou
        console.log(
          "Enviar um email para o usuário avisando que o pagamento falhou."
        );
        break;

      case "customer.subscription.created": // Assinatura criada
        console.log("Mensagem de boas vindas porque acabou de assinar");
        break;

      case "customer.subscription.deleted": // Assinatura cancelada
        await handleStripeCancelSubscription(event); // Lida com o cancelamento da assinatura
        break;

      default: // Evento não tratado
        console.log(`Unhandled event type ${event.type}`);
    }

    // Retorna uma resposta de sucesso para o Stripe
    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    // Em caso de erro, exibe o erro no console e retorna uma resposta de erro genérica
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
