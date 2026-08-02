import { GitHubRepository , GitHubLanguages , GitHubContributor } from "@/types/github";
import { formatDate } from "@/utils/formatDate";
import LanguageList from "./LanguageList";
import RepositoryStats from "./RepositoryStats";
import ContributorList from "./ContributorList";
import { formatNumber } from "@/utils/formatNumber";
import { formatSize } from "@/utils/formatSize";
import ReadmeCard from "./ReadmeCard";
import TopicList from "./TopicList";

type RepositoryCardProps = {
    repository : GitHubRepository,
    languages : GitHubLanguages,
    contributors: GitHubContributor[],
    readme : string,
}

export default function RepositoryCard ({
    repository, languages, contributors , readme }: RepositoryCardProps) {
        return(
                <div className="mt-8 rounded-lg border border-slate-700 p-6">
                        <h2 className="text-2xl font-bold">
                            {repository.full_name}
                        </h2>
                        <p className="mt-2">
                            {repository.description ?? "No description available."}
                        </p>

                        <hr className="my-6 border-slate-700" />
                        
                        <TopicList topics={repository.topics} />

                        <hr className="my-6 border-slate-700" />

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            
                            <RepositoryStats icon="⭐"  title="Stars"  value={formatNumber(repository.stargazers_count)} />
                            
                            <RepositoryStats  icon="🍴"  title="Forks"  value={formatNumber(repository.forks_count)} />
                            
                            <RepositoryStats  icon="🐛"  title="Open Issues"  value={formatNumber(repository.open_issues_count)}  />
                            
                            <RepositoryStats  icon="📦"  title="Size"  value={formatSize(repository.size)} />
                            
                        </div>

                        <hr className="my-6 border-slate-700" />

                        <div className="mt-4 space-y-4">
                            <p>
                                Default Branch : {repository.default_branch}
                            </p>
                            <p>
                                Licence : {repository.license?.name ?? "No license"}
                            </p>
                            <p>
                                Created : {formatDate(repository.created_at)}
                            </p>
                            <p>
                                Updated : {formatDate(repository.updated_at)}
                            </p>
                        </div>

                            <hr className="my-6 border-slate-700" />
                            
                            <LanguageList languages={languages} />

                            <hr className="my-6 border-slate-700" />

                            <ContributorList contributors={contributors} />

                            <hr className="my-6 border-slate-700" />

                            <ReadmeCard readme={readme} />

                        
                    </div>
                    
        )
}