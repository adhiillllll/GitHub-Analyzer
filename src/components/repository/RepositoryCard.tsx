import { GitHubRepository , GitHubLanguages } from "@/types/github";
import { formatDate } from "@/utils/formatDate";
import LanguageList from "./LanguageList";
import RepositoryStats from "./RepositoryStats";

type RepositoryCardProps = {
    repository : GitHubRepository,
    languages : GitHubLanguages
}

export default function RepositoryCard ({
    repository, languages }: RepositoryCardProps) {
        return(
                <div className="mt-8 rounded-lg border border-slate-700 p-6">
                        <h2 className="text-2xl font-bold">
                            {repository.full_name}
                        </h2>
                        <p className="mt-2">
                            {repository.description ?? "No description available."}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            
                            <RepositoryStats icon="⭐"  title="Stars"  value={repository.stargazers_count} />
                            
                            <RepositoryStats  icon="🍴"  title="Forks"  value={repository.forks_count} />
                            
                            <RepositoryStats  icon="🐛"  title="Open Issues"  value={repository.open_issues_count}  />
                            
                            <RepositoryStats  icon="👁"  title="Watchers"  value={repository.watchers_count} />
                            
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

                        
                    </div>
                    
        )
}