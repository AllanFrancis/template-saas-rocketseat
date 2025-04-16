"use client";
import { useStripe } from "@/app/hooks/useStripe";
import { Button } from "@/components/ui/button";

export default function Pagamentos() {
  const {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  } = useStripe();
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-4">
      <h1 className="text-2xl font-bold">Pagamentos</h1>
      <p className="text-lg">Essa página está em construção.</p>

      <Button
        onClick={() =>
          createPaymentStripeCheckout({
            testeId: "123",
          })
        }
      >
        Criar pagamento Stripe
      </Button>

      <Button
        onClick={() =>
          createSubscriptionStripeCheckout({
            testeId: "123",
          })
        }
      >
        Criar assinatura Stripe
      </Button>

      <Button onClick={handleCreateStripePortal}>
        Criar portal de pagamentos
      </Button>
    </div>
  );
}
