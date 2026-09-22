'use client';

import React, { useState, useEffect, useMemo } from "react";
import { GitHubRepository, GitHubLanguages, GitHubContributor, RepositoryAnalysis } from "@/types/github";
import { CodeHealthResult } from "@/types/codeHealth";
import { generateMarkdownReport } from "@/utils/generateMarkdownReport";
import { BiCopy, BiCheck, BiDownload, BiX } from "react-icons/bi";
import { FiFileText } from "react-icons/fi";

export type ExportReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  repository: GitHubRepository;
  languages?: GitHubLanguages;
  contributors?: GitHubContributor[];
  readme?: string;
  analysis?: RepositoryAnalysis | null;
  aiSummary?: string;
  aiLoading?: boolean;
  codeHealth?: CodeHealthResult | null;
  codeHealthLoading?: boolean;
  codeHealthError?: string | null;
};

export default function ExportReportModal({
  isOpen,
  onClose,
  repository,
  languages,
  contributors,
  readme,
  analysis,
  aiSummary,
  aiLoading,
  codeHealth,
  codeHealthLoading,
  codeHealthError,
}: ExportReportModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Generate markdown report memoized on input changes
  const markdownReport = useMemo(() => {
    if (!isOpen) return "";
    return generateMarkdownReport({
      repository,
      languages,
      contributors,
      readme,
      analysis,
      aiSummary,
      aiLoading,
      codeHealth,
      codeHealthLoading,
      codeHealthError,
    });
  }, [
    isOpen,
    repository,
    languages,
    contributors,
    readme,
    analysis,
    aiSummary,
    aiLoading,
    codeHealth,
    codeHealthLoading,
    codeHealthError,
  ]);

  // Handle keyboard events (Escape key to close modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (copied || !markdownReport) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(markdownReport);
      } else {
        // Fallback for non-secure context or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = markdownReport;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setActionSuccess("Copied to clipboard!");
      setTimeout(() => {
        setCopied(false);
        setActionSuccess(null);
      }, 2500);
    } catch (err) {
      console.error("Failed to copy report:", err);
    }
  };

  const handleDownload = () => {
    if (downloading || !markdownReport) return;

    try {
      setDownloading(true);
      const cleanRepoName = repository.name.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
      const filename = `${cleanRepoName}-analysis-report.md`;

      const blob = new Blob([markdownReport], { type: "text/markdown;charset=utf-8" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setActionSuccess(`Downloaded ${filename}!`);
      setTimeout(() => {
        setDownloading(false);
        setActionSuccess(null);
      }, 2500);
    } catch (err) {
      console.error("Failed to download report:", err);
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-[#121622] border border-[#1e2434] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#1e2434] bg-[#0f131c]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border border-[#00d68f]/30 bg-[#00d68f]/10 text-[#00d68f]">
              <FiFileText className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Export Analysis Report
              </h2>
              <p className="text-xs text-slate-400">
                {repository.full_name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#191f2f] transition"
            aria-label="Close modal"
          >
            <BiX className="text-2xl" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-[#151a28] border-b border-[#1e2434]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={copied}
              className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg border transition disabled:opacity-75 ${
                copied
                  ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-300"
                  : "border-[#283147] bg-[#1d2438] hover:bg-[#252e46] text-slate-200"
              }`}
            >
              {copied ? (
                <>
                  <BiCheck className="text-base text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <BiCopy className="text-base" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg border border-[#00d68f]/40 bg-[#00d68f]/10 hover:bg-[#00d68f]/20 text-[#00d68f] transition disabled:opacity-75"
            >
              {downloading ? (
                <>
                  <BiCheck className="text-base animate-bounce" />
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <BiDownload className="text-base" />
                  <span>Download .md File</span>
                </>
              )}
            </button>
          </div>

          {actionSuccess && (
            <span className="text-xs font-medium text-[#00d68f] animate-pulse">
              {actionSuccess}
            </span>
          )}
        </div>

        {/* Markdown Preview Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#080b11]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Markdown Preview
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {markdownReport.length.toLocaleString()} characters
            </span>
          </div>

          <pre className="p-4 rounded-xl bg-[#0d111a] border border-[#1e2434] text-xs font-mono text-slate-300 whitespace-pre-wrap break-words leading-relaxed select-all max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
            {markdownReport}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#1e2434] bg-[#0f131c]">
          <span className="text-xs text-slate-400">
            Includes all current analysis signals & metrics.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#1a202c] hover:bg-[#232a39] border border-[#2d3748] rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
