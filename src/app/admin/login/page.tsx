import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import { SlideUp } from "@/components/motion/primitives";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <SlideUp className="w-full max-w-sm space-y-8">
        <div className="space-y-3">
          <Logo />
          <h1 className="text-3xl font-semibold">Admin sign in</h1>
        </div>
        <LoginForm />
      </SlideUp>
    </main>
  );
}
