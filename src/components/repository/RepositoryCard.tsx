import React, { useState } from "react";
import { GitHubRepository, GitHubLanguages, GitHubContributor, RepositoryAnalysis } from "@/types/github";
import LanguageList from "./LanguageList";
import ContributorList from "./ContributorList";
import ReadmeCard from "./ReadmeCard";
import AnalysisCard from "./AnalysisCard";
import { formatNumber } from "@/utils/formatNumber";
import { formatSize } from "@/utils/formatSize";
import ReactMarkdown from "react-markdown";

import {
  BiFolder,
  BiStar,
  BiGitRepoForked,
  BiErrorCircle,
  BiGitPullRequest,
  BiCopy,
  BiRefresh,
  BiCompass,
  BiCodeAlt,
} from "react-icons/bi";
import { FiExternalLink, FiGitBranch } from "react-icons/fi";

type RepositoryCardProps = {
  repository: GitHubRepository;
  languages: GitHubLanguages;
  contributors: GitHubContributor[];
  readme: string;
  analysis?: RepositoryAnalysis | null;
  aiSummary?: string;
  aiLoading?: boolean;
  onGenerateAiSummary?: () => void;
};

export default function RepositoryCard({
  repository,
  languages,
  contributors,
  readme,
  analysis,
  aiSummary,
  aiLoading,
  onGenerateAiSummary,
}: RepositoryCardProps) {
  const [activeSubTab, setActiveSubTab] = useState("Summary");
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    if (aiSummary) {
      navigator.clipboard.writeText(aiSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const subTabs = [
    { id: "Summary", label: "Summary" },
    { id: "Code Health", label: "Code Health" },
    { id: "Architecture", label: "Architecture" },
    { id: "Security", label: "Security" },
    { id: "Roadmap", label: "Roadmap" },
  ];

  // Core modules derived or mockup fallback matching Image 2
  // const coreModules = [
  //   {
  //     package: "react-reconciler",
  //     role: "Implements the Fiber architecture.",
  //     complexity: "HIGH",
  //   },
  //   {
  //     package: "react-dom",
  //     role: "Host environment specific rendering.",
  //     complexity: "MEDIUM",
  //   },
  //   {
  //     package: "scheduler",
  //     role: "Cooperative task scheduling.",
  //     complexity: "HIGH",
  //   },
  // ];

  return (
    <div className="w-full space-y-6">
      {/* Repository Title & GitHub Link Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BiFolder className="text-2xl text-slate-300 shrink-0" />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {repository.full_name}
          </h1>
        </div>

        <a
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-[#232a3d] bg-[#121622] hover:bg-[#181d2a] text-slate-200 text-xs px-3.5 py-2 rounded-lg font-medium transition shrink-0 self-start sm:self-auto"
        >
          <FiExternalLink className="text-sm" />
          <span>GitHub</span>
        </a>
      </div>

      {/* Repository Badges Row */}
      <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-slate-300">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#232a3d] bg-[#121622] px-2.5 py-1">
          <span className="h-2 w-2 rounded-full bg-[#00d68f]" />
          <span>Public</span>
        </span>

        <span className="rounded-md border border-[#232a3d] bg-[#121622] px-2.5 py-1">
          {repository.license?.name || "No License"}
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#232a3d] bg-[#121622] px-2.5 py-1">
          <FiGitBranch className="text-slate-400" />
          <span>{repository.default_branch || "main"} Branch</span>
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#232a3d] bg-[#121622] px-2.5 py-1">
          <BiStar className="text-amber-400" />
          <span>{formatNumber(repository.stargazers_count)} Stars</span>
        </span>

        <span className="rounded-md border border-[#232a3d] bg-[#121622] px-2.5 py-1">
          {formatSize(repository.size)}
        </span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column (Metadata, Stats, Languages, Health, Contributors) */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-5">
          {/* Description Card */}
          <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-5 shadow-lg">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {repository.description || "No description provided."}
            </p>
          </div>

          {/* 2x2 Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <BiStar className="text-amber-400 text-sm" />
                <span>Stars</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">
                {repository.stargazers_count.toLocaleString()}
              </p>
            </div>

            <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <BiGitRepoForked className="text-blue-400 text-sm" />
                <span>Forks</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">
                {repository.forks_count.toLocaleString()}
              </p>
            </div>

            <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <BiErrorCircle className="text-emerald-400 text-sm" />
                <span>Issues</span>
              </div>
              <p className="text-lg font-bold text-white font-mono">
                {repository.open_issues_count.toLocaleString()}
              </p>
            </div>

            <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <BiGitPullRequest className="text-purple-400 text-sm" />
                <span>PRs</span>
              </div>
              {/* <p className="text-lg font-bold text-white font-mono">__</p> */}
            </div>
          </div>

          {/* Languages Component */}
          <LanguageList languages={languages} />

          {/* Repository Health Score */}
          {analysis && <AnalysisCard analysis={analysis} />}

          {/* Top Contributors Component */}
          <ContributorList contributors={contributors} />

          {/* Readme Card Component */}
          {readme && <ReadmeCard readme={readme} />}
        </div>

        {/* Right Column (Sub-Tabs, Summary, Modules Table, Code Snippet) */}
        <div className="flex-1 w-full space-y-5 min-w-0">
          {/* Sub-Tabs Bar */}
          <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-2 flex items-center justify-between overflow-x-auto gap-1">
            <div className="flex items-center gap-1">
              {subTabs.map((tab) => {
                const isActive = activeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${isActive
                        ? "bg-[#00d68f] text-[#081510]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-[#171d2b]"
                      }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-[#171d2b] rounded-lg transition">
              <BiCompass className="text-base" />
              <span>Explorer</span>
            </button>
          </div>

          {/* Repository Summary Card */}
          <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-6 shadow-lg space-y-4">
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
                    title="Refresh AI Summary"
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#191f2f] transition disabled:opacity-50"
                  >
                    <BiRefresh className={`text-base ${aiLoading ? "animate-spin text-blue-400" : ""}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Summary Content */}
            {aiSummary ? (
              <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed font-sans">
                <ReactMarkdown>{aiSummary}</ReactMarkdown>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    AI-powered repository insights will appear here after generating the
                    detailed summary.
                </p>

                {onGenerateAiSummary && (
                  <button
                    onClick={onGenerateAiSummary}
                    disabled={aiLoading}
                    className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[#283147] bg-[#151a28] px-4 py-2 text-xs font-semibold text-blue-300 hover:bg-[#1d2438] transition disabled:opacity-50"
                  >
                    <BiCodeAlt className="text-base" />
                    <span>{aiLoading ? "Generating AI Insights..." : "Generate Detailed AI Summary"}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Core Modules Breakdown Section */}
          {/* <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-6 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-slate-100">
              Core Modules Breakdown
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#1f2738] text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Package</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3 text-right">Complexity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181e2c] font-sans">
                  {coreModules.map((mod) => (
                    <tr key={mod.package} className="hover:bg-[#161b29] transition">
                      <td className="py-3 px-3 font-mono font-semibold text-blue-300">
                        {mod.package}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {mod.role}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            mod.complexity === "HIGH"
                              ? "bg-red-950/80 border border-red-800/80 text-red-400"
                              : "bg-amber-950/80 border border-amber-800/80 text-amber-400"
                          }`}
                        >
                          {mod.complexity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> */}

          {/* Code Example / Snippet Card */}
          {/* <div className="border border-[#1e2434] bg-[#0d1017] rounded-xl overflow-hidden shadow-lg"> */}
          {/* Header Window Controls */}
          {/* <div className="border-b border-[#1f2738] bg-[#121622] px-4 py-2.5 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-slate-400 truncate">
                packages/react-reconciler/src/ReactFiber.js
              </span>
            </div> */}

          {/* Code Body */}
          {/* <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
              <code>
                <span className="text-purple-400">function</span>{" "}
                <span className="text-blue-300">FiberNode</span>
                {"(\n"}
                {"  "}
                <span className="text-slate-400">tag:</span>{" "}
                <span className="text-amber-300">WorkTag</span>,{"\n"}
                {"  "}
                <span className="text-slate-400">pendingProps:</span>{" "}
                <span className="text-emerald-400">mixed</span>,{"\n"}
                {"  "}
                <span className="text-slate-400">key:</span>{" "}
                <span className="text-emerald-400">null | string</span>,{"\n"}
                {"  "}
                <span className="text-slate-400">mode:</span>{" "}
                <span className="text-emerald-400">TypeOfMode</span>,{"\n"}
                {") {\n"}
                {"  "}
                <span className="text-purple-400">this</span>.tag = tag;{"\n"}
                {"  "}
                <span className="text-purple-400">this</span>.key = key;{"\n"}
                {"  "}
                <span className="text-purple-400">this</span>.elementType = null;{"\n"}
                {"  "}
                <span className="text-purple-400">this</span>.type = null;{"\n"}
                {"  "}
                <span className="text-purple-400">this</span>.stateNode = null;{"\n"}
                {"}"}
              </code>
            </pre>
          </div> */}
        </div>
      </div>
    </div>
  );
}