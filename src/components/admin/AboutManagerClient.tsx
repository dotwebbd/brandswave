"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Save, Loader2, Sparkles, CheckCircle, Eye } from "lucide-react";
import { useToast } from "@/components/admin/ToastContext";
import { updateAboutAction } from "@/actions/admin-about";

interface AboutManagerClientProps {
  initialVision?: string;
  initialMission?: string;
}

export function AboutManagerClient({
  initialVision = "",
  initialMission = "",
}: AboutManagerClientProps) {
  const router = useRouter();
  const toast = useToast();

  const [vision, setVision] = useState(initialVision);
  const [mission, setMission] = useState(initialMission);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vision.trim()) {
      setError("Vision statement is required.");
      return;
    }
    if (!mission.trim()) {
      setError("Mission statement is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const res = await updateAboutAction({
        vision: vision.trim(),
        mission: mission.trim(),
      });

      if (res.success) {
        toast.success(res.message || "Vision & Mission updated.");
        router.refresh();
      } else {
        setError(res.error);
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to update About content.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foam flex items-center gap-2.5">
            <BookOpen className="h-7 w-7 text-glass" />
            About Page: Vision & Mission
          </h1>
          <p className="text-xs sm:text-sm text-foam/60 mt-1">
            Update BrandsWave core agency vision and mission statements rendered on the public About page.
          </p>
        </div>

        <a
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost py-2 px-3 text-xs font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Eye className="h-3.5 w-3.5" />
          View Public /about
        </a>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vision Editor */}
          <div className="rounded-2xl border border-foam/15 bg-tide/40 p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold uppercase tracking-wider text-glass flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-glass" />
                  Our Vision
                </label>
                <span className="text-[11px] text-foam/40 font-mono">
                  {vision.length} characters
                </span>
              </div>
              <textarea
                required
                rows={8}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="Describe BrandsWave long-term ambition, creative vision, and leadership in the Bangladesh entertainment and fashion industry..."
                className="input resize-none text-sm leading-relaxed"
              />
            </div>
            <p className="text-xs text-foam/50">
              Appears in the Vision highlight card on the About page.
            </p>
          </div>

          {/* Mission Editor */}
          <div className="rounded-2xl border border-foam/15 bg-tide/40 p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold uppercase tracking-wider text-sand flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-sand" />
                  Our Mission
                </label>
                <span className="text-[11px] text-foam/40 font-mono">
                  {mission.length} characters
                </span>
              </div>
              <textarea
                required
                rows={8}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="State BrandsWave daily commitment to models, clients, TVC directors, and global high-fashion standards..."
                className="input resize-none text-sm leading-relaxed"
              />
            </div>
            <p className="text-xs text-foam/50">
              Appears in the Mission highlight card on the About page.
            </p>
          </div>
        </div>

        {error && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-300">
            {error}
          </p>
        )}

        {/* Live Preview Panel */}
        <div className="rounded-2xl border border-foam/15 bg-abyss/60 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-foam/10 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-foam/60">
              Live Layout Preview (as shown to visitors)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="rounded-2xl border border-glass/20 bg-glass/5 p-6 space-y-3">
              <h3 className="font-display text-xl font-bold text-glass">Our Vision</h3>
              <p className="text-sm text-foam/80 leading-relaxed font-sans whitespace-pre-line">
                {vision || "Vision statement will render here…"}
              </p>
            </div>

            <div className="rounded-2xl border border-sand/20 bg-sand/5 p-6 space-y-3">
              <h3 className="font-display text-xl font-bold text-sand">Our Mission</h3>
              <p className="text-sm text-foam/80 leading-relaxed font-sans whitespace-pre-line">
                {mission || "Mission statement will render here…"}
              </p>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-4 border-t border-foam/10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary py-3 px-8 text-sm font-semibold inline-flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save & Publish Statements
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
