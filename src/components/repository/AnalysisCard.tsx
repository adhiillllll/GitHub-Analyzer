import { RepositoryAnalysis } from "@/types/github";
import AnalysisItem from "./AnalysisItem";

type AnalysisCardProps = {
    analysis : RepositoryAnalysis;
}

export default function AnalysisCard({
    analysis,
} : AnalysisCardProps ) {

    return (

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">

            <h2 className="text-2xl font-bold">
                Repository Health 
            </h2>

            <p className="mt-4 text-3xl font-bold text-blue-400">
                {analysis.score} / 100
            </p>

            <div className="mt-6 space-y-3">

                <AnalysisItem 
                    title="Documentation"
                    value={analysis.documentation} />

                <AnalysisItem
                    title="Popularity"
                    value={analysis.popularity} />

                <AnalysisItem
                    title="Community"
                    value={analysis.community} />

                <AnalysisItem
                    title="Maintenance"
                    value={analysis.maintenance} />

                <AnalysisItem
                    title="Activity"
                    value={analysis.activity} />
            </div>

        </div>
    )
}