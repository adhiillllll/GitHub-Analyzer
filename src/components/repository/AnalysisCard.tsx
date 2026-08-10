import { RepositoryAnalysis } from "@/types/github";

type AnalysisCardProps = {
    analysis: RepositoryAnalysis;
}

export default function AnalysisCard({
    analysis,
}: AnalysisCardProps) {
    return (
        <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Repository Signals
                </span>
                <span className="text-lg font-bold text-[#00d68f] font-mono">
                    {analysis.score}/100
                </span>
            </div>

            <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Documentation</span>
                    <span className="font-semibold text-[#00d68f]">
                        {analysis.documentation}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Maintenance</span>
                    <span className="font-semibold text-[#00d68f]">
                        {analysis.maintenance}
                    </span>
                </div>

                {analysis.community && (
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Community</span>
                        <span className="font-semibold text-slate-200">
                            {analysis.community}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}