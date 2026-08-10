export default function LogoSection() {
    return (
        <header className="text-center mb-8 flex flex-col items-center">
            {/* Concentric lens square icon */}
            <div className="mb-6 flex items-center justify-center h-14 w-14 rounded-xl border border-[#232a3d] bg-[#121622] text-slate-300 shadow-inner">
                <div className="h-6 w-6 rounded-full border-2 border-slate-300 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full border border-slate-300" />
                </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                RepoLens
            </h1>

            <p className="mt-3 max-w-xl text-base text-slate-400 font-normal leading-relaxed">
                Understand any GitHub repository with AI-powered engineering insights.
            </p>
        </header>
    )
}