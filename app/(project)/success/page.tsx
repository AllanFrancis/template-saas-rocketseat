'use client";';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <Card className="shadow-md rounded-lg p-8 max-w-md mx-auto">
        <CardHeader className="text-center mb-4">
          <CardTitle className="font-bold text-xl text-foreground">
            Pagamento realizado!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-foreground mb-4">Obrigado por sua compra.</p>
          <p className="text-foreground mb-4">
            Você receberá um e-mail de confirmação em breve.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard" className="">
              Voltar para o início
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
