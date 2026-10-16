"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Star, X } from "lucide-react";
import { useState } from "react";
import type { ReviewState } from "@/actions/reviews";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: ReviewState;
  action: (e: FormData) => void;
  pending: boolean;
}

export function ReviewModal({ isOpen, onClose, state, action, pending }: ReviewModalProps) {
  const [rating, setRating] = useState(5);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-abyss/80 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-[101] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-xl border border-foam/15 bg-abyss p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foam">Write a Review</h3>
                <button onClick={onClose} className="text-foam/50 hover:text-foam" aria-label="Close"><X className="h-5 w-5" /></button>
              </div>

              {state?.success ? (
                <div className="rounded-xl bg-glass/10 px-4 py-4 text-center">
                  <p className="font-semibold text-glass">Thanks!</p>
                  <p className="mt-1 text-sm text-foam/70">Your review awaits approval. We&rsquo;ll publish it shortly.</p>
                  <button onClick={onClose} className="mt-4 text-xs underline underline-offset-4 hover:text-glass">Close</button>
                </div>
              ) : (
                <form action={action} className="space-y-5" noValidate onSubmit={(e) => { e.preventDefault(); action(e.target as unknown as FormData); }}>
                  {state?.error && (
                    <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{state.error}</p>
                  )}

                  <div>
                    <label className="block text-sm text-foam/70 mb-2">Your Name</label>
                    <input name="name" type="text" required className="input" autoComplete="name" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-foam/70 mb-2">Designation</label>
                      <input name="designation" type="text" className="input" placeholder="e.g. Marketing Manager" />
                    </div>
                    <div>
                      <label className="block text-sm text-foam/70 mb-2">Company</label>
                      <input name="company" type="text" className="input" placeholder="e.g. Acme Corp" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-foam/70 mb-2">Rating</label>
                    <div className="flex flex-row-reverse gap-1">
                      {[5, 4, 3, 2, 1].map((r) => (
                        <button key={r} type="button" onClick={() => setRating(r)} className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${r <= rating ? "text-glass bg-glass/10" : "text-foam/30 hover:text-glass"}`} aria-label={`Rate ${r} stars`} aria-pressed={r === rating}>
                          <Star className="h-5 w-5 fill-current" aria-hidden />
                          <input type="radio" name="rating" value={r} checked={r === rating} onChange={() => setRating(r)} className="sr-only" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-foam/70 mb-2">Your Review</label>
                    <textarea name="text" rows={4} required className="input" placeholder="Tell us about your experience working with BrandsWave…" />
                  </div>

                  <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

                  <div className="flex gap-3">
                    <button type="button" onClick={onClose} className="flex-1 btn-ghost">Cancel</button>
                    <button type="submit" disabled={pending} className="flex-1 btn-primary">{pending ? "Submitting…" : "Submit Review"}</button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}