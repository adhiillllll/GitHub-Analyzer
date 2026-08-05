import { GitHubRepository , GitHubLanguages , GitHubContributor , RepositoryAnalysis } from "@/types/github";

export function buildSummaryPrompt(
    repository : GitHubRepository,
    languages : GitHubLanguages,
    contributors : GitHubContributor[],
    readme : string,
    analysis : RepositoryAnalysis,
)  {

    return `

    You are an experienced software engineer.

    Analyze this GitHub repository.

    Repository Name:
    ${repository.full_name}

    Description:
    ${repository.description}

    Primary Language:
    ${repository.language}

    Languages:
    ${Object.keys(languages).join(", ")}

    Contributors:
    ${contributors.length}

    Repository Health:
    ${analysis.score}/100

    Documentation:
    ${analysis.documentation}

    Popularity:
    ${analysis.popularity}

    Maintenance:
    ${analysis.maintenance}

    Activity:
    ${analysis.activity}

    README Preview:

    ${readme.slice(0, 2000)}
    
    `
}