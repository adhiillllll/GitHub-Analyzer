import React from "react";
import { GitHubRepository, GitHubLanguages, GitHubContributor, RepositoryAnalysis } from "@/types/github";
import LanguageList from "./LanguageList";
import ContributorList from "./ContributorList";
import ReadmeCard from "./ReadmeCard";
import AnalysisCard from "./AnalysisCard";
import SummaryPanel from "./SummaryPanel";
import CodeHealthPanel, { AnalysisMeta } from "./CodeHealthPanel";
import { CodeHealthResult } from "@/types/codeHealth";
import { formatNumber } from "@/utils/formatNumber";
import { formatSize } from "@/utils/formatSize";

import { BiFolder, BiStar, BiGitRepoForked, BiErrorCircle, BiGitPullRequest, BiCompass } from "react-icons/bi";
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
  activeTab: string;
  onSelectTab?: (tab: string) => void;
  codeHealth?: CodeHealthResult | null;
  codeHealthLoading?: boolean;
  codeHealthError?: string | null;
  codeHealthComplete?: boolean;
  codeHealthStatus?: number | null;
  codeHealthMeta?: AnalysisMeta | null;
  onRetryCodeHealth?: () => void;
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
  activeTab,
  onSelectTab,
  codeHealth,
  codeHealthLoading,
  codeHealthError,
  codeHealthComplete,
  codeHealthStatus,
  codeHealthMeta,
  onRetryCodeHealth,
}: RepositoryCardProps) {


  const subTabs = [
    { id: "Summary", label: "Summary" },
    { id: "Code Health", label: "Code Health" },
    { id: "Security", label: "Security" },
    { id: "Dependencies", label: "Dependencies" },
  ];

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
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectTab?.(tab.id)}
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

          {activeTab === "Summary" && (
            <SummaryPanel
              repository={repository}
              aiSummary={aiSummary}
              aiLoading={aiLoading}
              onGenerateAiSummary={onGenerateAiSummary}
            />
          )}

          {activeTab === "Code Health" && (
            <CodeHealthPanel
              codeHealth={codeHealth}
              loading={codeHealthLoading}
              error={codeHealthError}
              complete={codeHealthComplete}
              statusCode={codeHealthStatus}
              analysisMeta={codeHealthMeta}
              onRetry={onRetryCodeHealth}
            />
          )}

          {activeTab === "Security" && (
            <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white">
                Security
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Security analysis will appear here.
              </p>
            </div>
          )}

          {activeTab === "Dependencies" && (
            <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white">
                Dependencies
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Dependency analysis will appear here.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}