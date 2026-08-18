import { CodeHealthResult } from "@/types/codeHealth";
import { BiCheckCircle, BiError, BiRightArrowAlt, BiRefresh, BiLoaderAlt } from "react-icons/bi";

type CodeHealthPanelProps = {
  codeHealth?: CodeHealthResult | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

function scoreLabel(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Attention";
  return "Critical";
}

export default function CodeHealthPanel({
  codeHealth,
  loading = false,
  error = null,
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
                / 100
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-200">
                {scoreLabel(codeHealth.overallScore)}
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* Category scores */}
      <section className="border border-[#1e2434] bg-[#121622] rounded-xl p-6">

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-white">
            Engineering Signals
          </h3>

          <span className="text-xs text-slate-500">
            AI reviewed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

          {categories.map(([name, category]) => (
            <div
              key={name}
              className="border border-[#1e2434] bg-[#0f131c] rounded-lg p-4">
              <div className="flex items-center justify-between gap-3">

                <span className="text-sm text-slate-300">
                  {name}
                </span>

                <span className="text-sm font-bold text-white font-mono">
                  {category.score}
                </span>

              </div>

              <div className="mt-3 h-1.5 rounded-full bg-[#1c2332] overflow-hidden">

                <div
                  className="h-full bg-[#00d68f] rounded-full transition-all"
                  style={{
                    width: `${Math.min(Math.max(category.score, 0), 100)}%`,
                  }} />

              </div>

              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                {category.summary}
              </p>
            </div>
          ))}

        </div>
      </section>


      {/* Strengths */}
      {codeHealth.strengths.length > 0 && (
        <section className="border border-[#1e2434] bg-[#121622] rounded-xl p-6">

          <h3 className="text-sm font-semibold text-white mb-4">
            What the project does well
          </h3>

          <div className="space-y-3">

            {codeHealth.strengths.map((strength, index) => (
              <div
                key={index}
                className="flex items-start gap-3">

                <BiCheckCircle className="mt-0.5 shrink-0 text-[#00d68f] text-lg" />

                <p className="text-sm text-slate-300 leading-relaxed">
                  {strength}
                </p>
              </div>
            ))}

          </div>
        </section>
      )}


      {/* Issues */}
      {codeHealth.issues.length > 0 && (
        <section className="border border-[#1e2434] bg-[#121622] rounded-xl p-6">

          <div className="flex items-center justify-between mb-5">

            <h3 className="text-sm font-semibold text-white">
              Findings
            </h3>

            <span className="text-xs text-slate-500">
              {codeHealth.issues.length} findings
            </span>

          </div>

          <div className="space-y-3">

            {codeHealth.issues.map((issue, index) => (

              <div
                key={index}
                className="border border-[#1e2434] bg-[#0f131c] rounded-lg p-4" >

                <div className="flex items-start gap-3">

                  <BiError className="mt-0.5 shrink-0 text-amber-400 text-lg" />

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-2">

                      <h4 className="text-sm font-semibold text-slate-200">
                        {issue.title}
                      </h4>

                      <span className="text-[10px] uppercase font-bold tracking-wide text-slate-400 border border-[#283147] rounded px-2 py-0.5">
                        {issue.severity}
                      </span>

                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                      {issue.description}
                    </p>

                    {issue.files && issue.files.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">

                        {issue.files.map((file) => (
                          <code
                            key={file}
                            className="text-[11px] text-blue-300 bg-[#151b28] border border-[#232a3d] rounded px-2 py-1" >
                            {file}
                          </code>
                        ))}

                      </div>
                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>
        </section>
      )}


      {/* Recommendations */}
      {codeHealth.recommendations.length > 0 && (
        <section className="border border-[#1e2434] bg-[#121622] rounded-xl p-6">

          <h3 className="text-sm font-semibold text-white mb-5">
            Recommended Improvements
          </h3>

          <div className="space-y-3">

            {codeHealth.recommendations.map((recommendation, index) => (

              <div
                key={index}
                className="flex items-start gap-3 border border-[#1e2434] bg-[#0f131c] rounded-lg p-4" >

                <BiRightArrowAlt className="mt-0.5 shrink-0 text-blue-400 text-lg" />

                <div>

                  <div className="flex items-center gap-2">

                    <h4 className="text-sm font-semibold text-slate-200">
                      {recommendation.title}
                    </h4>

                    <span className="text-[10px] uppercase text-slate-500">
                      {recommendation.priority}
                    </span>

                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {recommendation.description}
                  </p>

                </div>

              </div>

            ))}

          </div>
        </section>
      )}

    </div>
  )
}