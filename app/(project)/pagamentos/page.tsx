"use client";

import useMercadoPago from "@/app/hooks/useMercadoPago";
import { useStripe } from "@/app/hooks/useStripe";
import { useSession } from "next-auth/react";

export default function Pagamentos() {
  const { createPaymentStripeCheckout, createSubscriptionStripeCheckout, handleCreateStripePortal } = useStripe();
  const { createMercadoPagoCheckout } = useMercadoPago();

  function handleCreatePayment() {
    createPaymentStripeCheckout({
      testeId: "123",
      userEmail: "allanfrancis.dev@gmail.com",
      userId: "TIWIsG4aezoyMTdAyaWQ",
    });
  }

  function handleCreateSubscription() {
    createSubscriptionStripeCheckout({
      testeId: "123",
      userEmail: "allanfrancis.dev@gmail.com",
      userId: "TIWIsG4aezoyMTdAyaWQ",
    });
  }

  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Pagamentos</h1>
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
