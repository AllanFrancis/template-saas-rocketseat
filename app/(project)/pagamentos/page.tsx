"use client";

import useMercadoPago from "@/app/hooks/useMercadoPago";
import { useStripe } from "@/app/hooks/useStripe";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Pagamentos() {
  const { createPaymentStripeCheckout, createSubscriptionStripeCheckout, handleCreateStripePortal } = useStripe();
  const { createMercadoPagoCheckout } = useMercadoPago();
  const { data: session } = useSession();

  function handleCreatePayment() {
    if (!session?.user?.email) {
      console.error("Email não encontrado na sessão do usuário.");
      return;
    }

    createPaymentStripeCheckout({
      testeId: "123",
      userEmail: session?.user?.email,
    });
  }

  function handleCreateSubscription() {
    if (!session?.user?.email) {
      console.error("Email não encontrado na sessão do usuário.");
      return;
    }
    createSubscriptionStripeCheckout({
      testeId: "123",
      userEmail: session?.user?.email,
    });
  }

  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Pagamentos</h1>
      <h1 className="text-4xl font-bold">{session?.user?.email}</h1>

      <button className="border rounded-md px-1" onClick={handleCreatePayment}>
        Criar Pagamento Stripe
      </button>
      <button className="border rounded-md px-1" onClick={handleCreateSubscription}>
        Criar Assinatura Stripe
      </button>
      <button className="border rounded-md px-1" onClick={handleCreateStripePortal}>
        Criar Portal de Pagamento
      </button>
      <button
        className="border rounded-md px-1"
        onClick={() =>
          createMercadoPagoCheckout({
            testeId: "123",
            userEmail: "teste@gmail.com",
          })
        }
      >
        Criar Pagamento Mercado Pago
      </button>
    </div>
  );
}
