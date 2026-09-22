import React from "react";
import { AnalysisStage, ANALYSIS_STAGES } from "@/types/analysisProgress";
import { BiCheckCircle, BiLoaderAlt, BiCircle } from "react-icons/bi";

type AnalysisProgressPanelProps = {
  currentStage: AnalysisStage;
};

const STAGE_ORDER: AnalysisStage[] = [
  "fetching-repo",
  "loading-data",
  "calculating-metrics",
  "generating-code-health",
  "complete",
];

export default function AnalysisProgressPanel({ currentStage }: AnalysisProgressPanelProps) {
  if (currentStage === "idle") return null;

  const currentIndex = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className="mt-4 rounded-xl border border-[#1f2638] bg-[#0d1017] p-4 shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between border-b border-[#1c2232] pb-2.5 mb-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          {currentStage !== "complete" && (
            <BiLoaderAlt className="animate-spin text-blue-400 text-sm" />
          )}
          <span>Analysis Progress</span>
        </h4>
        <span className="text-[11px] font-mono text-slate-400">
          {currentStage === "complete" ? "100% Completed" : `Stage ${Math.min(currentIndex + 1, 4)} of 4`}
        </span>
      </div>

      <div className="space-y-2.5 font-mono text-xs">
        {ANALYSIS_STAGES.map((stageItem, index) => {
          const stageIndex = STAGE_ORDER.indexOf(stageItem.id);
          const isCompleted = currentIndex > stageIndex || currentStage === "complete";
          const isActive = currentStage === stageItem.id;
          const isPending = currentIndex < stageIndex && currentStage !== "complete";

          return (
            <div
              key={stageItem.id}
              className={`flex items-center gap-3 transition-colors duration-200 ${
                isActive
                  ? "text-blue-300 font-semibold"
                  : isCompleted
                  ? "text-slate-300"
                  : "text-slate-500"
              }`}
            >
              {isCompleted && (
                <BiCheckCircle className="text-emerald-400 text-base shrink-0" />
              )}
              {isActive && (
                <BiLoaderAlt className="animate-spin text-blue-400 text-base shrink-0" />
              )}
              {isPending && (
                <BiCircle className="text-slate-600 text-base shrink-0" />
              )}

              <span className="truncate">{stageItem.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
