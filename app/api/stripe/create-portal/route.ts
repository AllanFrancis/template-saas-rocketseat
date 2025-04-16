// Importa a função de autenticação para obter informações do usuário autenticado
import { auth } from "@/app/lib/auth";
// Importa a instância do Firestore configurada
import { db } from "@/app/lib/firebase";
// Importa a instância do Stripe configurada
import stripe from "@/app/lib/stripe";
// Importa os tipos e funções do Next.js para lidar com requisições e respostas
import { NextRequest, NextResponse } from "next/server";

// Função que lida com requisições POST para criar uma sessão no portal de faturamento do Stripe
export async function POST(req: NextRequest) {
  // Obtém a sessão do usuário autenticado
  const session = await auth();

  // Obtém o ID do usuário autenticado a partir da sessão
  const userId = session?.user?.id;

  // Verifica se o usuário está autenticado. Caso contrário, retorna um erro de autorização.
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Obtém a referência do documento do usuário no Firestore
    const userRef = db.collection("users").doc(userId);
    // Busca os dados do documento do usuário
    const userDoc = await userRef.get();

    // Verifica se o documento do usuário existe no Firestore
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Obtém o ID do cliente no Stripe associado ao usuário
    const customerId = userDoc.data()?.stripeCustomerId; // Este campo deve ser salvo no Firestore ao criar o cliente no Stripe

    // Verifica se o ID do cliente no Stripe está presente. Caso contrário, retorna um erro.
    if (!customerId) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Cria uma sessão no portal de faturamento do Stripe para o cliente
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId, // ID do cliente no Stripe
      return_url: `${req.headers.get("origin")}/`, // URL para redirecionar o usuário após sair do portal
    });

    // Retorna a URL da sessão do portal de faturamento
    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    // Em caso de erro, exibe o erro no console e retorna uma resposta de erro genérica
    console.error(error);
    return NextResponse.error();
  }
}
