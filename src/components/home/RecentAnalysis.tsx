'use client'

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { BiFolder, BiStar } from 'react-icons/bi';
import { formatNumber } from '@/utils/formatNumber';

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

  return (
    <div className="w-full mt-10">
      {/* Header with bottom border divider matching mockup screenshot */}
      <div className="flex items-center justify-between border-b border-[#232938] pb-2.5 mb-4">
        <h3 className="text-sm font-semibold text-slate-200 tracking-wide">
          Recent Analyses
        </h3>
        <Link href="/history" className="text-xs text-slate-300 hover:text-white font-medium transition cursor-pointer">
          View All
        </Link>
      </div>

      {/* 3-Column Card Grid */}
      {recentRepos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recentRepos.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectRepo?.(item.githubUrl)}
            className="group border border-[#232938] bg-[#141824] hover:bg-[#191f2e] hover:border-[#38435d] rounded-lg p-5 transition cursor-pointer flex flex-col justify-between shadow-md"
          >
            <div className="flex items-start gap-3">
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
    </div>
  );
}
