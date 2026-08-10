'use client'

import React from 'react';
import { BiFolder, BiStar } from 'react-icons/bi';

type RecentAnalysisProps = {
  onSelectRepo?: (url: string) => void;
};

const RECENT_REPOS = [
  {
    name: 'facebook/react',
    url: 'https://github.com/facebook/react',
    version: 'v18.2.0',
    stars: '211k',
  },
  {
    name: 'tailwindcss/tailwindcss',
    url: 'https://github.com/tailwindcss/tailwindcss',
    version: 'v3.4.1',
    stars: '74.5k',
  },
  {
    name: 'vercel/next.js',
    url: 'https://github.com/vercel/next.js',
    version: 'v14.1.0',
    stars: '118k',
  },
];

export default function RecentAnalysis({ onSelectRepo }: RecentAnalysisProps) {
  return (
    <div className="w-full mt-10">
      {/* Header with bottom border divider matching mockup screenshot */}
      <div className="flex items-center justify-between border-b border-[#232938] pb-2.5 mb-4">
        <h3 className="text-sm font-semibold text-slate-200 tracking-wide">
          Recent Analyses
        </h3>
        <button className="text-xs text-slate-300 hover:text-white font-medium transition cursor-pointer">
          View All
        </button>
      </div>

      {/* 3-Column Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {RECENT_REPOS.map((item) => (
          <div
            key={item.name}
            onClick={() => onSelectRepo?.(item.url)}
            className="group border border-[#232938] bg-[#141824] hover:bg-[#191f2e] hover:border-[#38435d] rounded-lg p-5 transition cursor-pointer flex flex-col justify-between shadow-md"
          >
            <div className="flex items-start gap-3">
              <BiFolder className="text-slate-300 text-2xl shrink-0 mt-0.5 group-hover:text-blue-400 transition" />
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-100 truncate group-hover:text-white transition">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {item.version}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1.5 text-xs text-slate-300 font-mono mt-5">
              <BiStar className="text-amber-400 text-sm" />
              <span>{item.stars}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
