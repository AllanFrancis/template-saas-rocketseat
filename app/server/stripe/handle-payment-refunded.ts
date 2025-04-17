import { db } from "@/app/lib/firebase";
import resend from "@/app/lib/resend";
import "server-only";

import Stripe from "stripe";

export async function handleStripeRefundPayment(event: Stripe.ChargeRefundedEvent) {
  console.log("Estornou o pagamento");

  const userEmail = event.data.object.billing_details?.email;
  const userRef = await db.collection("users").where("email", "==", userEmail).get();

  if (!userEmail || !userRef) {
    console.error("User not found");
    return;
  }

  const userId = userRef.docs[0].id;

  console.log("userId ========", userId);

  await db.collection("users").doc(userId).update({
    subscriptionStatus: "inactive",
  });

  const { data, error } = await resend.emails.send({
    from: "Template Saas <me@tatamepro.com.br>",
    to: [userEmail],
    subject: "Pagamento foi estornado",
    text: "Pagamento foi estornado e sua fatura cancelada",
  });

  if (error) {
    console.error(error);
  }

  console.log(data);
}
