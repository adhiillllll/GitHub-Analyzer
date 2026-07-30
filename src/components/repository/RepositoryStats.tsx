import { formatNumber } from "@/utils/formatNumber"

type RepositoryStatsProps = {
    icon : React.ReactNode,
    title : string,
    value : number,
}


export default function RepositoryStats({
    icon,
    title,
    value,
} : RepositoryStatsProps) {
    
    return(
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">

            <div className="text-2xl">
                {icon}
            </div>

            <p className="mt-3 text-2xl font-bold text-white">
                {formatNumber(value)}
            </p>

            <p className="text-sm text-slate-400"> 
                {title}
            </p>

        </div>
    )
}