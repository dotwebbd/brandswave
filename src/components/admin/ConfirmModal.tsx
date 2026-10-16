"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isDestructive = true,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isLoading && onClose()}
          className="fixed inset-0 bg-abyss/80 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-md rounded-2xl border border-foam/15 bg-tide p-6 shadow-2xl z-10"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-start gap-4">
            <div
              className={`rounded-xl p-3 shrink-0 ${
                isDestructive ? "bg-red-500/15 text-red-400 border border-red-500/20" : "bg-sand/15 text-sand border border-sand/20"
              }`}
            >
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <h3 className="text-lg font-semibold text-foam">{title}</h3>
              <p className="text-sm text-foam/70 leading-relaxed">{description}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="rounded-xl border border-foam/20 px-4 py-2.5 text-sm font-medium text-foam hover:bg-swell/50 transition-colors disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={async () => {
                await onConfirm();
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
                isDestructive
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-glass text-abyss hover:bg-foam"
              }`}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
