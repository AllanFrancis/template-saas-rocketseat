import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="text-4xl font-bold">Landing Page</h1>
      <Link href="/dashboard">
        <Button className="px-4 py-2 rounded-3xl">
          accessar pagina de login
        </Button>
      </Link>
    </div>
  );
}
