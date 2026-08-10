import { GitHubLanguages } from "@/types/github";

type LanguageListProps = {
    languages: GitHubLanguages
}

const LANGUAGE_COLORS: Record<string, string> = {
    JavaScript: '#f7b731',
    TypeScript: '#3178c6',
    CSS: '#00d68f',
    HTML: '#e34c26',
    Python: '#3572a5',
    Shell: '#89e051',
    C: '#555555',
    'C++': '#f34b7d',
    Java: '#b07219',
    Go: '#00add8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4f5d95',
};

export default function LanguageList({
    languages,
}: LanguageListProps) {
    const totalBytes = Object.values(languages).reduce(
        (total, bytes) => total + bytes, 0
    );

    if (totalBytes === 0) return null;

    const items = Object.entries(languages).map(([language, bytes]) => {
        const percentage = Math.max(1, Math.round((bytes / totalBytes) * 100));
        const color = LANGUAGE_COLORS[language] || '#8b949e';
        return { language, percentage, color };
    });

    return (
        <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-5 shadow-lg">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Languages
            </h3>

            {/* Multi-colored bar */}
            <div className="h-2.5 w-full rounded-full bg-[#181d2b] flex overflow-hidden gap-0.5">
                {items.map((item) => (
                    <div
                        key={item.language}
                        style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                        }}
                        className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300"
                        title={`${item.language}: ${item.percentage}%`}
                    />
                ))}
            </div>

            {/* Legend list */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300 font-mono">
                {items.map((item) => (
                    <div key={item.language} className="flex items-center gap-1.5">
                        <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="font-semibold text-slate-200">{item.language}</span>
                        <span className="text-slate-400">{item.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}