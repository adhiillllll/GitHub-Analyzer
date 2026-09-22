import React from "react";

export default function RepositorySkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded bg-[#1e2434]" />
          <div className="h-7 w-64 rounded bg-[#1e2434]" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-9 w-20 rounded-lg bg-[#1e2434]" />
          <div className="h-9 w-28 rounded-lg bg-[#1e2434]" />
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="h-4 w-3/4 rounded bg-[#161b29]" />

      {/* Stat Cards Grid Skeleton (4 cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-[#1e2434] bg-[#121622] p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 rounded bg-[#1c2232]" />
              <div className="h-4 w-4 rounded bg-[#1c2232]" />
            </div>
            <div className="h-7 w-24 rounded bg-[#1c2232]" />
            <div className="h-3 w-20 rounded bg-[#161b29]" />
          </div>
        ))}
      </div>

      {/* Subtabs Bar Skeleton */}
      <div className="flex items-center gap-2 border-b border-[#1e2434] pb-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-24 rounded-lg bg-[#1e2434]" />
        ))}
      </div>

      {/* Main Content Panels Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[#1e2434] bg-[#121622] p-6 space-y-4">
            <div className="h-5 w-36 rounded bg-[#1c2232]" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-[#161b29]" />
              <div className="h-3 w-5/6 rounded bg-[#161b29]" />
              <div className="h-3 w-4/6 rounded bg-[#161b29]" />
            </div>
          </div>

          <div className="rounded-xl border border-[#1e2434] bg-[#121622] p-6 space-y-4">
            <div className="h-5 w-32 rounded bg-[#1c2232]" />
            <div className="h-32 w-full rounded-lg bg-[#0d1017]" />
          </div>
        </div>

        {/* Right Column (1 col) */}
        <div className="space-y-6">
          {/* Languages List Skeleton */}
          <div className="rounded-xl border border-[#1e2434] bg-[#121622] p-5 space-y-3">
            <div className="h-4 w-28 rounded bg-[#1c2232]" />
            <div className="h-2 w-full rounded-full bg-[#1c2232]" />
            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <div className="h-3 w-20 rounded bg-[#161b29]" />
                <div className="h-3 w-10 rounded bg-[#161b29]" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-16 rounded bg-[#161b29]" />
                <div className="h-3 w-8 rounded bg-[#161b29]" />
              </div>
            </div>
          </div>

          {/* Contributors List Skeleton */}
          <div className="rounded-xl border border-[#1e2434] bg-[#121622] p-5 space-y-3">
            <div className="h-4 w-32 rounded bg-[#1c2232]" />
            <div className="space-y-2 pt-1">
              {[1, 2, 3].map((c) => (
                <div key={c} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#1c2232]" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3 w-24 rounded bg-[#161b29]" />
                    <div className="h-2 w-16 rounded bg-[#161b29]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
