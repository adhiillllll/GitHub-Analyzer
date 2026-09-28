'use client';

import React, { useState } from "react";
import Link from "next/link";
import { BiHistory, BiPlus, BiTrash, BiLoaderAlt } from "react-icons/bi";
import { formatNumber } from "@/utils/formatNumber";
import { formatDate } from "@/utils/formatDate";
import ClearHistoryModal from "./ClearHistoryModal";

export type HistoryItem = {
  id: string;
  fullName: string;
  githubUrl: string;
  description: string | null;
  stars: number | null;
  language: string | null;
  createdAt: string;
};

type HistoryListProps = {
  initialHistory: HistoryItem[];
  userEmail?: string | null;
  isLoggedIn: boolean;
};

export default function HistoryList({
  initialHistory,
  userEmail,
  isLoggedIn,
}: HistoryListProps) {
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isLoggedIn || history.length === 0) {
    return (
      <div className="border border-[#1e2434] bg-[#121622] rounded-2xl p-10 sm:p-14 max-w-md w-full shadow-2xl space-y-5 mx-auto text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#1c2234] border border-[#283147] flex items-center justify-center text-slate-400 text-2xl">
          <BiHistory />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            {isLoggedIn ? "No analysis history yet" : "Sign in to view history"}
          </h2>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed font-mono">
            {isLoggedIn
              ? "Repositories you analyze will appear here."
              : "Your analysis history is tied to your account."}
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full bg-[#9bb8ff] hover:bg-[#8ab0ff] text-[#0a1020] font-semibold text-xs py-2.5 px-4 rounded-lg transition active:scale-[0.98] shadow"
        >
          <BiPlus className="text-base" />
          <span>New Analysis</span>
        </Link>
      </div>
    );
  }

  const handleDeleteItem = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (deletingId) return;

    try {
      setDeletingId(id);
      setErrorMsg(null);

      const response = await fetch(`/api/history?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete history item.");
      }

      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete history item error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Could not delete item.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (clearing) return;

    try {
      setClearing(true);
      setErrorMsg(null);

      const response = await fetch("/api/history?clearAll=true", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to clear history.");
      }

      setHistory([]);
      setIsClearModalOpen(false);
    } catch (err) {
      console.error("Clear history error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to clear history.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">History</h1>
          <p className="mt-1 text-xs text-slate-400 font-mono">
            Recent analyses for {userEmail}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsClearModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition"
        >
          <BiTrash className="text-sm" />
          <span>Clear All</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
          {errorMsg}
        </div>
      )}

      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="group border border-[#1e2434] bg-[#121622] hover:bg-[#181d2a] rounded-xl p-5 transition flex flex-col justify-between"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/?repo=${encodeURIComponent(item.fullName)}`}
                  className="text-sm font-bold text-white hover:text-blue-400 truncate block transition"
                >
                  {item.fullName}
                </Link>
                <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                  {item.description ?? "No description provided."}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-start">
                <span className="text-[11px] text-slate-500 font-mono">
                  {formatDate(item.createdAt)}
                </span>

                <button
                  type="button"
                  onClick={(e) => handleDeleteItem(e, item.id)}
                  disabled={deletingId === item.id}
                  title="Delete from history"
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-[#1c2234] transition disabled:opacity-40"
                >
                  {deletingId === item.id ? (
                    <BiLoaderAlt className="animate-spin text-sm" />
                  ) : (
                    <BiTrash className="text-sm" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono border-t border-[#1a202e] pt-3">
              <div className="flex items-center gap-3">
                <span>{item.language ?? "Unknown"}</span>
                <span>{formatNumber(item.stars ?? 0)} stars</span>
              </div>

              <a
                href={item.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white underline transition"
              >
                View on GitHub
              </a>
            </div>
          </div>
        ))}
      </div>

      <ClearHistoryModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearAll}
        loading={clearing}
        error={errorMsg}
      />
    </div>
  );
}
