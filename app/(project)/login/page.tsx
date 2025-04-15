import { handleAuth } from "@/app/actions/handle-auth";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Login</h1>
      <form action={handleAuth}>
        <Button type="submit" className="px-4 py-2 rounded-3xl">
          Signin with Google
        </Button>
      </form>
    </div>
  );
}
