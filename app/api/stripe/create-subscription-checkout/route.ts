// Importa a função de autenticação para obter informações do usuário autenticado
import { auth } from "@/app/lib/auth";
// Importa a instância do Stripe configurada
import stripe from "@/app/lib/stripe";
// Importa a função para criar ou obter um cliente no Stripe
import { getOrCreateCustomer } from "@/app/server/stripe/get-or-create-customer";
// Importa os tipos e funções do Next.js para lidar com requisições e respostas
import { NextRequest, NextResponse } from "next/server";

// Função que lida com requisições POST para criar uma sessão de checkout de assinatura no Stripe
export async function POST(req: NextRequest) {
  // Extrai os dados enviados no corpo da requisição (JSON)
  const { testeId } = await req.json();

  // Obtém o ID do preço da assinatura do ambiente (variável de ambiente)
  const price = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;

  // Verifica se o preço está configurado. Caso contrário, retorna um erro.
  if (!price) {
    return NextResponse.json({ error: "Price not found" }, { status: 500 });
  }

  // Obtém a sessão do usuário autenticado
  const session = await auth();
  const userId = session?.user?.id; // ID do usuário autenticado
  const userEmail = session?.user?.email; // E-mail do usuário autenticado

  // Verifica se o usuário está autenticado. Caso contrário, retorna um erro de autorização.
  if (!userId || !userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Cria ou obtém o cliente no Stripe com base no ID e e-mail do usuário
  const customerId = await getOrCreateCustomer(userId, userEmail);

  // Define os metadados que serão enviados para o Stripe
  const metadata = {
    testeId, // ID do teste associado à assinatura
    price, // ID do preço da assinatura
    userId, // ID do usuário autenticado
  };

  // Precisamos criar um cliente no Stripe para ter referência dele ao criar o portal de assinaturas

  try {
    // Cria uma sessão de checkout de assinatura no Stripe
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price, quantity: 1 }], // Define os itens da assinatura (neste caso, apenas um item com o preço configurado)
      mode: "subscription", // Define o modo como assinatura
      payment_method_types: ["card"], // Define os métodos de pagamento aceitos (apenas cartão)
      success_url: `${req.headers.get("origin")}/success`, // URL para redirecionar o usuário em caso de sucesso
      cancel_url: `${req.headers.get("origin")}/`, // URL para redirecionar o usuário em caso de cancelamento
      metadata, // Adiciona os metadados definidos anteriormente
      customer: customerId, // Associa a sessão ao cliente criado no Stripe
    });

    // Verifica se a URL da sessão foi gerada. Caso contrário, retorna um erro.
    if (!session.url) {
      return NextResponse.json(
        { error: "Session URL not found" },
        { status: 500 }
      );
    }

    // Retorna o ID da sessão criada com status 200 (sucesso)
    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    // Em caso de erro, exibe o erro no console e retorna uma resposta de erro genérica
    console.error(error);
    return NextResponse.error();
  }
}
