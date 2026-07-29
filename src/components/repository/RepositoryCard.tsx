import { GitHubRepository } from "@/types/github";
import { formatDate } from "@/utils/formatDate";

type RepositoryCardProps = {
    repository : GitHubRepository
}

export default function RepositoryCard ({
    repository, }: RepositoryCardProps) {
        return(
                <div className="mt-8 rounded-lg border border-slate-700 p-6">
                        <h2 className="text-2xl font-bold">
                            {repository.full_name}
                        </h2>
                        <p className="mt-2">
                            {repository.description ?? "No description available."}
                        </p>
                        <div className="mt-4 space-y-2">
                            <p>
                                Stars : {repository.stargazers_count}
                            </p>
                            <p>
                                Forks : {repository.forks_count}
                            </p>
                            <p>
                                Language : {repository.language}
                            </p>
                            <p>
                                Open issues : {repository.open_issues_count}
                            </p>
                            <p>
                                Watchers : {repository.watchers_count}
                            </p>
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
                    </div>
        )
}