import { GitHubContributor } from "@/types/github";

type ContributorCardProps = {
    contributor : GitHubContributor;
};

export default function ContributorCard({
    contributor,
} : ContributorCardProps ) {
    return(
        <a href={contributor.html_url}
           target="_blank"
           rel="noopener noreferrer"
           className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800 p-3 hover:bg-slate-700 transition">

            <img src={contributor.avatar_url}  alt={contributor.login}  className="h-12 w-12 rounded-full"  />

            <div>

                <h4 className="font-semibold">
                    {contributor.login}
                </h4>

                <p className="text-sm text-slate-400">
                    {contributor.contributions} Contributions
                </p>

            </div>

        </a>
    )
}