import { GitHubContributor } from "@/types/github";

type ContributorListProps = {
    contributors: GitHubContributor[];
}

export default function ContributorList({
    contributors
}: ContributorListProps) {
    if (contributors.length === 0) return null;

    const visibleContributors = contributors.slice(0, 4);
    const extraCount = Math.max(0, contributors.length - 4);

    return (
        <div className="border border-[#1e2434] bg-[#121622] rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Top Contributors
                </h3>
                <button className="text-xs text-slate-400 font-mono hover:text-slate-200 transition">
                    View All
                </button>
            </div>

            <div className="flex items-center -space-x-2">
                {visibleContributors.map((c) => (
                    <a
                        key={c.id}
                        href={c.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${c.login} (${c.contributions} contributions)`}
                        className="relative z-0 hover:z-10 transition transform hover:-translate-y-0.5"
                    >
                        <img
                            src={c.avatar_url}
                            alt={c.login}
                            className="h-9 w-9 rounded-full border-2 border-[#121622] object-cover"
                        />
                    </a>
                ))}

                {extraCount > 0 && (
                    <div className="h-9 w-9 rounded-full border-2 border-[#121622] bg-[#1a202c] text-[11px] font-mono text-slate-300 font-semibold flex items-center justify-center shrink-0">
                        +{extraCount > 999 ? `${Math.floor(extraCount / 1000)}k` : extraCount}
                    </div>
                )}
            </div>
        </div>
    );
}