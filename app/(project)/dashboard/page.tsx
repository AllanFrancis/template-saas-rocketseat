import { handleAuth } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <div className="flex flex-col items-center justify-center mb-4">
        <h1 className="text-4xl font-bold">Desafio Micro Saas</h1>
        <p>NextJS, Auth.JS, Firestore, Stripe e Mercado Pago</p>
      </div>

      <Card className="flex flex-col items-center justify-center ">
        <CardContent className="flex flex-col justify-center">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={session?.user?.image ?? "/default-image.png"}
                alt="User Image"
                className="rounded-full"
              />
            </Avatar>

            <div className="flex flex-col">
              <p>{session?.user?.name}</p>
              <p>{session?.user?.email}</p>
            </div>
          </div>

          {session?.user?.email && (
            <form action={handleAuth}>
              <Button
                type="submit"
                variant="default"
                className="px-4 py-2 mt-4 w-full"
              >
                Logout
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
