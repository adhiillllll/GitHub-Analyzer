'use client'

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { BiFolder, BiStar, BiTrash, BiLoaderAlt } from 'react-icons/bi';
import { formatNumber } from '@/utils/formatNumber';
import ClearHistoryModal from '../history/ClearHistoryModal';

type RecentAnalysisProps = {
  onSelectRepo?: (url: string) => void;
};

type RecentItem = {
  id: string;
  fullName: string;
  githubUrl: string;
  language: string | null;
  stars: number | null;
};

export default function RecentAnalysis({ onSelectRepo }: RecentAnalysisProps) {
  const [recentRepos, setRecentRepos] = useState<RecentItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadHistory() {
      try {
        const response = await fetch("/api/history");

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (mounted && data.success && Array.isArray(data.history)) {
          const seen = new Set<string>();
          const uniqueItems = data.history.filter((item: RecentItem) => {
            if (seen.has(item.githubUrl)) return false;
            seen.add(item.githubUrl);
            return true;
          });
          setRecentRepos(uniqueItems.slice(0, 3));
        }
      } finally {
        if (mounted) {
          setLoaded(true);
        }
      }
    }

    loadHistory();

    return () => {
      mounted = false;
    };
  }, []);

  const handleDeleteItem = async (e: React.MouseEvent, id: string) => {
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

      setRecentRepos((prev) => prev.filter((item) => item.id !== id));
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

      setRecentRepos([]);
      setIsClearModalOpen(false);
    } catch (err) {
      console.error("Clear all history error:", err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to clear history.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="w-full mt-10">
      {/* Header with bottom border divider matching mockup screenshot */}
      <div className="flex items-center justify-between border-b border-[#232938] pb-2.5 mb-4">
        <h3 className="text-sm font-semibold text-slate-200 tracking-wide">
          Recent Analyses
        </h3>
        <div className="flex items-center gap-3">
          {recentRepos.length > 0 && (
            <button
              type="button"
              onClick={() => setIsClearModalOpen(true)}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium transition cursor-pointer"
            >
              Clear All
            </button>
          )}
          <Link href="/history" className="text-xs text-slate-300 hover:text-white font-medium transition cursor-pointer">
            View All
          </Link>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
          {errorMsg}
        </div>
      )}

      {/* 3-Column Card Grid */}
      {recentRepos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recentRepos.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectRepo?.(item.githubUrl)}
              className="group border border-[#232938] bg-[#141824] hover:bg-[#191f2e] hover:border-[#38435d] rounded-lg p-5 transition cursor-pointer flex flex-col justify-between shadow-md relative"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 min-w-0">
                  <BiFolder className="text-slate-300 text-2xl shrink-0 mt-0.5 group-hover:text-blue-400 transition" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-slate-100 truncate group-hover:text-white transition">
                      {item.fullName}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {item.language ?? "Unknown"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDeleteItem(e, item.id)}
                  disabled={deletingId === item.id}
                  title="Remove from history"
                  className="p-1 text-slate-500 hover:text-rose-400 rounded transition disabled:opacity-40 shrink-0"
                >
                  {deletingId === item.id ? (
                    <BiLoaderAlt className="animate-spin text-sm" />
                  ) : (
                    <BiTrash className="text-sm" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-end gap-1.5 text-xs text-slate-300 font-mono mt-5">
                <BiStar className="text-amber-400 text-sm" />
                <span>{formatNumber(item.stars ?? 0)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-[#232938] bg-[#141824] rounded-lg p-5 text-xs text-slate-400 font-mono">
          {loaded ? "No recent analyses yet." : "Loading recent analyses..."}
        </div>
      )}

      {/* Clear All Confirmation Modal */}
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
