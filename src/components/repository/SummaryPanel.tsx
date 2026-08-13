import React, { useState } from "react";
import { GitHubRepository } from "@/types/github";
import ReactMarkdown from "react-markdown";
import {
  BiCopy,
  BiRefresh,
  BiCodeAlt,
} from "react-icons/bi";

type SummaryPanelProps = {
  repository: GitHubRepository;
  aiSummary?: string;
  aiLoading?: boolean;
  onGenerateAiSummary?: () => void;
};

export default function SummaryPanel({
  repository,
  aiSummary,
  aiLoading,
  onGenerateAiSummary,
}: SummaryPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = async () => {
    if (!aiSummary) return;

    await navigator.clipboard.writeText(aiSummary);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="space-y-5">

      {/* Repository Summary */}
      <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-6 shadow-lg">

        <div className="flex items-center justify-between">

          <h3 className="text-sm font-bold text-slate-100">
            Repository Summary
          </h3>

          <div className="flex items-center gap-2">

            {aiSummary && (
              <button
                onClick={handleCopySummary}
                title="Copy AI Summary"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#191f2f] transition"
              >
                <BiCopy className="text-base" />
              </button>
            )}

            {onGenerateAiSummary && (
              <button
                onClick={onGenerateAiSummary}
                disabled={aiLoading}
                title="Generate AI Summary"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#191f2f] transition disabled:opacity-50"
              >
                <BiRefresh
                  className={`text-base ${
                    aiLoading
                      ? "animate-spin text-blue-400"
                      : ""
                  }`}
                />
              </button>
            )}

          </div>

        </div>

        {/* AI Summary */}
        {aiSummary ? (

          <div className="prose prose-invert max-w-none mt-5 text-sm text-slate-300 leading-relaxed">
            <ReactMarkdown>
              {aiSummary}
            </ReactMarkdown>
          </div>

        ) : (

          <div className="mt-5 space-y-4">

            <p className="text-sm text-slate-300 leading-relaxed">
              {repository.description ||
                `${repository.full_name} is a GitHub repository that can be analyzed for its structure, technologies, maintainability, and overall engineering health.`}
            </p>

            {onGenerateAiSummary && (
              <button
                onClick={onGenerateAiSummary}
                disabled={aiLoading}
                className="inline-flex items-center gap-2 rounded-lg border border-[#283147] bg-[#151a28] px-4 py-2 text-xs font-semibold text-blue-300 hover:bg-[#1d2438] transition disabled:opacity-50"
              >
                <BiCodeAlt className="text-base" />

                <span>
                  {aiLoading
                    ? "Generating AI Insights..."
                    : "Generate Detailed AI Summary"}
                </span>
              </button>
            )}

          </div>

        )}

        {/* Copy feedback */}
        {copied && (
          <p className="mt-3 text-xs text-[#00d68f]">
            Summary copied to clipboard.
          </p>
        )}

      </div>

      {/* Repository Overview */}
      <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-6 shadow-lg">

        <h3 className="text-sm font-bold text-slate-100">
          Repository Overview
        </h3>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="rounded-lg border border-[#1e2434] bg-[#0f131c] p-4">
            <p className="text-xs text-slate-500">
              Repository
            </p>

            <p className="mt-1 text-sm font-medium text-slate-200">
              {repository.full_name}
            </p>
          </div>

          <div className="rounded-lg border border-[#1e2434] bg-[#0f131c] p-4">
            <p className="text-xs text-slate-500">
              Default Branch
            </p>

            <p className="mt-1 text-sm font-medium text-slate-200">
              {repository.default_branch || "main"}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}