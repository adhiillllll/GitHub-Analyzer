import { useState, useEffect } from "react";
import { CodeHealthResult } from "@/types/codeHealth";
import { BiError, BiRefresh, BiLoaderAlt } from "react-icons/bi";

export type ProviderStatusInfo = {
  provider: string;
  label: string;
  model: string;
  status: "available" | "rate_limited" | "error";
  limitType?: string;
  retryAfterSeconds?: number;
};

export type AnalysisMeta = {
  totalChunks: number;
  successfulChunks: number;
  failedChunks: number;
  skippedChunks: number;
  providers?: ProviderStatusInfo[];
};

type CodeHealthPanelProps = {
  codeHealth?: CodeHealthResult | null;
  loading?: boolean;
  error?: string | null;
  complete?: boolean;
  statusCode?: number | null;
  analysisMeta?: AnalysisMeta | null;
  onRetry?: () => void;
};

function scoreLabel(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Attention";
  return "Critical";
}

function CodeHealthRateLimitPanel({
  error,
  providers,
  onRetry,
}: {
  error: string;
  providers: ProviderStatusInfo[];
  onRetry?: () => void;
}) {
  const [providerList, setProviderList] = useState(providers);
  const [prevProviders, setPrevProviders] = useState(providers);

  if (providers !== prevProviders) {
    setPrevProviders(providers);
    setProviderList(providers);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setProviderList((prev) =>
        prev.map((p) => {
          if (p.retryAfterSeconds !== undefined && p.retryAfterSeconds > 0) {
            return { ...p, retryAfterSeconds: p.retryAfterSeconds - 1 };
          }
          return p;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs?: number) => {
    if (secs === undefined || secs === null) return null;
    if (secs <= 0) return "Provider cooldown ended — you can retry now.";

    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m > 0) {
      return `Retry in ${m}m ${s < 10 ? "0" : ""}${s}s`;
    }
    return `Retry in ${s}s`;
  };

  return (
    <div className="border border-amber-900/40 bg-[#171412] rounded-xl p-8 space-y-6">
      <div className="flex items-center gap-3 text-amber-400">
        <BiError className="text-3xl shrink-0" />
        <div className="text-left">
          <h3 className="text-base font-semibold text-white">
            AI analysis temporarily unavailable
          </h3>
          <p className="text-xs text-amber-300/80">
            {error || "All configured AI providers are currently rate-limited."}
          </p>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {providerList.map((p, idx) => {
          const isCooling = p.retryAfterSeconds !== undefined && p.retryAfterSeconds > 0;
          const limitMsg = p.limitType || "AI provider rate limit reached";
          const countdownText = formatCountdown(p.retryAfterSeconds);

          return (
            <div
              key={idx}
              className="border border-[#2d251e] bg-[#0f0d0b] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">
                    {p.label || `${p.provider} (${p.model})`}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Rate limited
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  {limitMsg}
                </p>
              </div>

              {countdownText && (
                <div className="text-right shrink-0">
                  <span className={isCooling ? "text-amber-300 font-semibold" : "text-[#00d68f] font-semibold"}>
                    {countdownText}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e2434] hover:bg-[#283147] text-slate-200 text-xs font-semibold rounded-lg transition border border-[#2b354d]"
        >
          <BiRefresh className="text-base" />
          <span>Retry Analysis</span>
        </button>
      )}
    </div>
  );
}

export default function CodeHealthPanel({
  codeHealth,
  loading = false,
  error = null,
  complete = true,
  statusCode = null,
  analysisMeta = null,
  onRetry,
}: CodeHealthPanelProps) {

  if (loading) {
    const steps = [
      { label: "Repository fetched", status: "completed" },
      { label: "Source files selected", status: "completed" },
      { label: "Analyzing code chunks with LLM models", status: "active" },
      { label: "Synthesizing category signals & observations", status: "pending" },
      { label: "Preparing final engineering health report", status: "pending" },
    ];

    return (
      <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <BiLoaderAlt className="text-2xl text-[#00d68f] animate-spin" />
          <div>
            <h3 className="text-base font-semibold text-white">
              Analyzing repository...
            </h3>
            <p className="text-xs text-slate-400">
              Reviewing source code chunks and calculating engineering health metrics.
            </p>
          </div>
        </div>

        <div className="border border-[#1e2434] bg-[#0b0e14] rounded-lg p-5 space-y-3 font-mono text-xs">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {step.status === "completed" && (
                <span className="text-[#00d68f]">✓</span>
              )}
              {step.status === "active" && (
                <span className="text-[#00d68f] animate-pulse">→</span>
              )}
              {step.status === "pending" && (
                <span className="text-slate-600">•</span>
              )}

              <span
                className={
                  step.status === "completed"
                    ? "text-slate-300"
                    : step.status === "active"
                      ? "text-[#00d68f] font-semibold"
                      : "text-slate-500"
                }
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    if (statusCode === 503 && analysisMeta?.providers && analysisMeta.providers.length > 0) {
      return (
        <CodeHealthRateLimitPanel
          error={error}
          providers={analysisMeta.providers}
          onRetry={onRetry}
        />
      );
    }

    return (
      <div className="border border-red-900/40 bg-[#171116] rounded-xl p-8 text-center space-y-4">
        <BiError className="mx-auto text-3xl text-red-400" />
        <div>
          <h3 className="text-base font-semibold text-white">
            Code Health Analysis Failed
          </h3>
          <p className="mt-1 text-xs text-red-300/80 max-w-md mx-auto">
            {error}
          </p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e2434] hover:bg-[#283147] text-slate-200 text-xs font-semibold rounded-lg transition"
          >
            <BiRefresh className="text-base" />
            <span>Retry Analysis</span>
          </button>
        )}
      </div>
    );
  }

  if (!codeHealth) {
    return (
      <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-8 text-center">
        <h2 className="text-lg font-semibold text-white">
          Code Health
        </h2>

        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          AI-powered code health analysis will review the repository source
          code and provide engineering insights.
        </p>
      </div>
    );
  }


  const categories = [
    ["Architecture", codeHealth.categories.architecture],
    ["Maintainability", codeHealth.categories.maintainability],
    ["Code Quality", codeHealth.categories.codeQuality],
    ["Testing", codeHealth.categories.testing],
    ["Security", codeHealth.categories.security],
    ["Type Safety", codeHealth.categories.typeSafety],
    ["Documentation", codeHealth.categories.documentation],
  ] as const;

  return (
    <div className="space-y-5">
      {complete === false && analysisMeta && (
        <div className="border border-amber-500/30 bg-amber-500/10 text-amber-300 rounded-xl p-4 text-xs flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>
              Partial Analysis — {analysisMeta.successfulChunks} of {analysisMeta.totalChunks} code chunks analyzed ({analysisMeta.skippedChunks} skipped due to AI provider limits).
            </span>
          </div>
        </div>
      )}


      {/* Overall score */}
      <section className="border border-[#1e2434] bg-[#121622] rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              AI Code Health
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Engineering Quality
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              AI review of the repository source code and engineering practices.
            </p>
          </div>

          <div className="flex items-center gap-4">

            <div className="text-right">
              <p className="text-3xl font-bold text-[#00d68f] font-mono">
                {codeHealth.overallScore}
              </p>

              <p className="text-xs text-slate-500">
                Overall Score
              </p>
            </div>

            <div className="h-10 w-px bg-[#1e2434]" />

            <div>
              <span className="px-3 py-1 bg-[#1e2434] text-[#00d68f] font-semibold text-xs rounded-full">
                {scoreLabel(codeHealth.overallScore)}
              </span>
            </div>

          </div>

        </div>
      </section>


      {/* Category Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(([title, cat]) => (
          <div
            key={title}
            className="border border-[#1e2434] bg-[#121622] rounded-xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <span className="font-mono text-sm font-bold text-[#00d68f]">
                {cat.score}/100
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {cat.summary}
            </p>
          </div>
        ))}
      </section>


      {/* Strengths */}
      {codeHealth.strengths && codeHealth.strengths.length > 0 && (
        <section className="border border-[#1e2434] bg-[#121622] rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="text-[#00d68f]">✓</span>
            Key Engineering Strengths
          </h3>

          <ul className="space-y-2 font-mono text-xs">
            {codeHealth.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-slate-300">
                <span className="text-[#00d68f] select-none">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </section>
      )}


      {/* Issues */}
      {codeHealth.issues && codeHealth.issues.length > 0 && (
        <section className="border border-[#1e2434] bg-[#121622] rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="text-amber-400">⚠</span>
            Detected Architectural & Code Issues
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {codeHealth.issues.map((issue, idx) => (
              <div
                key={idx}
                className="border border-[#1e2434] bg-[#0b0e14] rounded-lg p-4 space-y-2 text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-200">{issue.title}</span>
                  <span
                    className={
                      issue.severity === "high"
                        ? "px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30"
                        : issue.severity === "medium"
                          ? "px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-700/50 text-slate-300"
                    }
                  >
                    {issue.severity.toUpperCase()}
                  </span>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed">
                  {issue.description}
                </p>

                {issue.files && issue.files.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {issue.files.map((f, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-[#171b26] text-slate-400 text-[11px] rounded font-mono"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}


      {/* Recommendations */}
      {codeHealth.recommendations && codeHealth.recommendations.length > 0 && (
        <section className="border border-[#1e2434] bg-[#121622] rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="text-[#00d68f]">💡</span>
            Actionable Recommendations
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {codeHealth.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="border border-[#1e2434] bg-[#0b0e14] rounded-lg p-4 space-y-2 text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-200">{rec.title}</span>
                  <span
                    className={
                      rec.priority === "high"
                        ? "px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30"
                        : rec.priority === "medium"
                          ? "px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-700/50 text-slate-300"
                    }
                  >
                    {rec.priority.toUpperCase()} PRIORITY
                  </span>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed">
                  {rec.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}