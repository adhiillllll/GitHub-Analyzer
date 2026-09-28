'use client';

import React from "react";
import { BiTrash, BiX, BiErrorCircle } from "react-icons/bi";

export type ClearHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  error?: string | null;
};

export default function ClearHistoryModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  error = null,
}: ClearHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#121622] border border-[#1e2434] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1e2434] bg-[#0f131c]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <BiErrorCircle className="text-xl" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Clear Analysis History
            </h3>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#191f2f] transition disabled:opacity-50"
            aria-label="Close modal"
          >
            <BiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to clear your entire analysis history? This will permanently remove all your recently analyzed repositories from your account history.
          </p>

          <p className="text-[11px] text-slate-400 font-mono">
            This action cannot be undone.
          </p>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
              {error}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1e2434] bg-[#0f131c]">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#1a202c] hover:bg-[#232a39] border border-[#2d3748] rounded-lg transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg transition disabled:opacity-50 shadow-md"
          >
            <BiTrash className="text-sm" />
            <span>{loading ? "Clearing..." : "Clear All History"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
