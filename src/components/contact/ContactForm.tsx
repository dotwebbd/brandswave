"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { submitLeadAction, type LeadState } from "@/actions/leads";

export function ContactForm() {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLeadAction, undefined);

  return (
    <form action={action} className="space-y-5" noValidate>
      {state?.error && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200"
        >
          {state.error}
        </motion.p>
      )}

      {state?.success && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-glass/10 border border-glass/20 px-4 py-4 text-center"
        >
          <p className="font-semibold text-glass">Thanks for reaching out!</p>
          <p className="mt-1 text-sm text-foam/70">We&rsquo;ve received your inquiry and will respond within one business day.</p>
        </motion.div>
      )}

      {!state?.success && (
        <>
          <div>
            <label htmlFor="name" className="block text-sm text-foam/70 mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="input"
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm text-foam/70 mb-2">
                Phone <span className="text-foam/40 text-xs font-normal">(WhatsApp preferred)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                className="input"
                placeholder="+880 1XXX XXXXXX"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-foam/70 mb-2">
                Email (optional)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="input"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="projectBrief" className="block text-sm text-foam/70 mb-2">
              Project Brief
            </label>
            <textarea
              id="projectBrief"
              name="projectBrief"
              rows={5}
              required
              className="input"
              placeholder="Tell us about your project: campaign type, timeline, budget, models needed…"
            />
          </div>

          {/* Honeypot */}
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <button
            type="submit"
            disabled={pending}
            className="btn-primary w-full"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden />
                Sending…
              </>
            ) : (
              <>
                Send Inquiry <ArrowRight className="h-4 w-4 ml-1" aria-hidden />
              </>
            )}
          </button>
        </>
      )}
    </form>
  );
}