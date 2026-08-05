type AnalysisItemProps = {
    title: string;
    value: string;
}

export default function AnalysisItem({
    title,
    value,
}: AnalysisItemProps) {

    return (

        <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 px-4 py-3">

            <span className="font-medium">
                {title}
            </span>

            <span className="font-semibold text-blue-400">
                {value}
            </span>

        </div>

    )
}