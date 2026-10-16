"use client";

import { useActionState, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, AlertCircle, ShieldAlert } from "lucide-react";
import { loginAction, type LoginState } from "@/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, undefined);
  const [email, setEmail] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setClientError(null);
    const form = e.currentTarget;
    const formEmail = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    const formPass = (form.elements.namedItem("password") as HTMLInputElement)?.value;

    if (!formEmail || !formEmail.includes("@")) {
      e.preventDefault();
      setClientError("Please enter a valid email address.");
      return;
    }
    if (!formPass || formPass.length < 8) {
      e.preventDefault();
      setClientError("Password must be at least 8 characters.");
      return;
    }
  };

  const isRateLimited = state?.error?.toLowerCase().includes("too many attempts");

  return (
    <form action={action} onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-foam/70">
          Admin Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foam/40" />
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@brandswave.com"
            autoComplete="username"
            required
            className="input pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-foam/70">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foam/40" />
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••••••"
            autoComplete="current-password"
            required
            className="input pl-10"
          />
        </div>
      </div>

      {/* Honeypot field */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {(clientError || state?.error) && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            isRateLimited
              ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
              : "border-red-400/30 bg-red-400/10 text-red-200"
          }`}
        >
          {isRateLimited ? (
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
          )}
          <div className="flex-1 font-medium leading-relaxed">{clientError || state?.error}</div>
        </motion.div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full py-3.5 text-base font-semibold shadow-lg shadow-glass/10 transition-all active:scale-[0.99]"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          "Sign in to Portal"
        )}
      </button>

      <p className="text-center text-xs text-foam/40">
        Secured with encrypted HTTP-only session cookies and strict rate-limiting.
      </p>
    </form>
  );
}
