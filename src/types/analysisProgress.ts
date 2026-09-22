export type AnalysisStage =
  | "idle"
  | "fetching-repo"
  | "loading-data"
  | "calculating-metrics"
  | "generating-code-health"
  | "complete";

export type StageItem = {
  id: AnalysisStage;
  label: string;
};

export const ANALYSIS_STAGES: StageItem[] = [
  { id: "fetching-repo", label: "Fetching repository information" },
  { id: "loading-data", label: "Loading languages and contributors" },
  { id: "calculating-metrics", label: "Preparing repository metrics" },
  { id: "generating-code-health", label: "Generating AI code health" },
];
