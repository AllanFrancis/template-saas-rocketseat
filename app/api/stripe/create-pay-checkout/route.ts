// Importa a instância do Stripe configurada
import stripe from "@/app/lib/stripe";
// Importa os tipos e funções do Next.js para lidar com requisições e respostas
import { NextRequest, NextResponse } from "next/server";

// Função que lida com requisições POST para criar uma sessão de checkout no Stripe
export async function POST(req: NextRequest) {
  // Extrai os dados enviados no corpo da requisição (JSON)
  const { testeId, userEmail } = await req.json();

  // Obtém o ID do preço do produto do ambiente (variável de ambiente)
  const price = process.env.STRIPE_PRODUCT_PRICE_ID;

  // Verifica se o preço está configurado. Caso contrário, retorna um erro.
  if (!price) {
    return NextResponse.json({ error: "Price not found" }, { status: 500 });
  }

  // Define os metadados que serão enviados para o Stripe
  const metadata = {
    testeId, // ID do teste associado à compra
    price, // ID do preço do produto
    userEmail, // E-mail do usuário que está realizando a compra
  };

  try {
    // Cria uma sessão de checkout no Stripe
    const session = await stripe.checkout.sessions.create({
      // Define os itens da compra (neste caso, apenas um item com o preço configurado)
      line_items: [{ price, quantity: 1 }],
      // Define o modo de pagamento (pagamento único)
      mode: "payment",
      // Define os métodos de pagamento aceitos (cartão e boleto)
      payment_method_types: ["card", "boleto"],
      // URL para redirecionar o usuário em caso de sucesso no pagamento
      success_url: `${req.headers.get("origin")}/success`,
      // URL para redirecionar o usuário em caso de cancelamento do pagamento
      cancel_url: `${req.headers.get("origin")}/`,
      // Adiciona o e-mail do cliente, se fornecido
      ...(userEmail && { customer_email: userEmail }),
      // Adiciona os metadados definidos anteriormente
      metadata,
    });

    // Verifica se a URL da sessão foi gerada. Caso contrário, retorna um erro.
    if (!session.url) {
      return NextResponse.json({ error: "Session URL not found" }, { status: 500 });
    }

    // Retorna o ID da sessão criada com status 200 (sucesso)
    return NextResponse.json({ sessionId: session.id }, { status: 200 });
  } catch (error) {
    // Em caso de erro, exibe o erro no console e retorna uma resposta de erro genérica
    console.error(error);
    return NextResponse.error();
  }
}
