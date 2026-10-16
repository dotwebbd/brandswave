"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlideUp, FadeIn } from "@/components/motion/primitives";
import { submitReviewAction, type ReviewState } from "@/actions/reviews";
import { useActionState } from "react";
import { Star, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReviewModal } from "./ReviewModal";

interface Review {
  id: string;
  clientName: string;
  designation: string | null;
  company: string | null;
  rating: number;
  text: string;
}

interface ReviewSliderProps {
  reviews: Review[];
}

export function ReviewSlider({ reviews }: ReviewSliderProps) {
  const [index, setIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [state, reviewAction, pending] = useActionState<ReviewState, FormData>(submitReviewAction, undefined);

  useEffect(() => {
    if (!autoPlay || reviews.length === 0) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 5000);
    return () => clearInterval(timer);
  }, [autoPlay, reviews.length]);

  const prev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length);
  const next = () => setIndex((i) => (i + 1) % reviews.length);

  return (
    <section className="py-24 bg-tide/30" aria-labelledby="review-slider-heading">
      <div className="container-page">
        <div className="flex flex-col lg:flex-row lg:items-end gap-8 mb-14">
          <div className="flex-1">
            <SlideUp>
              <h2 id="review-slider-heading" className="text-3xl font-semibold sm:text-4xl text-foam tracking-tight">
                What our clients say
              </h2>
            </SlideUp>
            <SlideUp delay={0.1}>
              <p className="mt-4 text-foam/70 max-w-md leading-relaxed">
                Hear from the brands and creators we’ve worked with across Dhaka and beyond.
              </p>
            </SlideUp>
          </div>
          <div className="flex-shrink-0">
            <SlideUp delay={0.2}>
              <button onClick={() => setIsOpen(true)} className="btn-primary" aria-label="Write a review">
                <MessageCircle className="h-4 w-4 mr-2" aria-hidden />
                Write a Review
              </button>
            </SlideUp>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-foam/10 bg-tide/50 p-8 md:p-12"
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          {reviews.length === 0 ? (
            <FadeIn className="text-center py-10">
              <p className="text-foam/60">No reviews yet. Be the first to share your experience.</p>
            </FadeIn>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div key={index} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="text-center">
                  <div className="flex justify-center gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={cn("h-5 w-5", star <= reviews[index].rating ? "text-glass" : "text-foam/30")} aria-hidden />
                    ))}
                  </div>
                  <p className="text-lg sm:text-xl text-foam/90 italic leading-relaxed max-w-2xl mx-auto mb-6">&ldquo;{reviews[index].text}&rdquo;</p>
                  <p className="font-semibold text-foam">{reviews[index].clientName}</p>
                  {reviews[index].designation || reviews[index].company ? (
                    <p className="mt-1 text-sm text-foam/60">{reviews[index].designation}{reviews[index].designation && reviews[index].company && " | "}{reviews[index].company}</p>
                  ) : null}
                </motion.div>
              </AnimatePresence>

              {reviews.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-abyss/60 hover:bg-glass text-foam transition-colors" aria-label="Previous review"><ChevronLeft className="h-5 w-5" aria-hidden /></button>
                  <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-abyss/60 hover:bg-glass text-foam transition-colors" aria-label="Next review"><ChevronRight className="h-5 w-5" aria-hidden /></button>
                  <div className="mt-6 flex justify-center gap-2">
                    {reviews.map((_, i) => (
                      <button key={i} onClick={() => setIndex(i)} className={cn("h-2 w-2 rounded-full transition-colors", i === index ? "bg-glass" : "bg-foam/30 hover:bg-glass")} aria-label={`Review ${i + 1}`} aria-pressed={i === index} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <AnimatePresence>
          {isOpen && <ReviewModal isOpen={isOpen} onClose={() => setIsOpen(false)} state={state} action={reviewAction} pending={pending} />}
        </AnimatePresence>
      </div>
    </section>
  );
}