type LanguageProgressProps = {
    language : string;
    percentage : number;
}


export default function LanguageProgress({
    language,
    percentage
} : LanguageProgressProps) {
    return(
        <div className="space-y-2">

            <div className="flex justify-between text-sm">
                <span>{language}</span>
                <span>{percentage}%</span>
            </div>

            <div className="h-2 w-full rounded-full bg-slate-700">
                <div className="h-2 rounded-full bg-blue-500"
                     style={{ width: `${percentage}%`, }} />
            </div>

        </div>
    )
}