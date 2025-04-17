import { db } from "@/app/lib/firebase";
import resend from "@/app/lib/resend";
import "server-only";

import Stripe from "stripe";

export async function handleStripPayment(event: Stripe.CheckoutSessionCompletedEvent) {
  if (event.data.object.payment_status === "paid") {
    console.log("Pagamento realizado com sucesso. Enviar um email liberar acesso.");

    const { metadata, customer_email, customer_details } = event.data.object;
    const userEmail = customer_email || customer_details?.email;
    const userId = metadata?.userId;

    event.data.object;

    console.log("metadata ========", metadata);
    console.log("userEmail ========", userEmail);
    console.log("userId ======== HANDLE PAY", userId);

    if (!userId || !userEmail) {
      console.error("User ID or email not found");
      return;
    }

    await db.collection("users").doc(userId).update({
      stripeSubscriptionId: event.data.object.subscription,
      subscriptionStatus: "active",
    });

    const { data, error } = await resend.emails.send({
      from: "Acme <me@tatamepro.com.br>",
      to: [userEmail],
      subject: "Pagamento realizado com sucesso",
      text: "Pagamento realizado com sucesso",
    });

    if (error) {
      console.error(error);
    }

    console.log(data);
  }
}
