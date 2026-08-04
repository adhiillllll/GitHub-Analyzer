import { GitHubRepository , RepositoryAnalysis , GitHubContributor, AnalysisResult } from "@/types/github";


function calculateDocumentation(
    readme : string,
) : AnalysisResult {

    if (readme.trim().length > 0) {
        return {
            score : 20,
            label : "Documented",
        }
    }

    return   {
        score : 0,
        label : "No README",
    }; 
}


function calculatePopularity(
    repository : GitHubRepository,
) : AnalysisResult {
    
    const star = repository.stargazers_count;

    if (star >= 500) {
        return {
            score : 20,
            label : "Famous",
        }
    }

    if (star >= 100) {
        return {
            score : 15,
            label : "Popular",
        }
    }

    if (star >= 10) {
        return {
            score : 10,
            label : "Growing",
        }
    }

    return {
        score : 5,
        label : "Hidden",
    }
}


function calculateCommunity(
    contributors : GitHubContributor[],
) : AnalysisResult {

    const total = contributors.length

    if (total >= 10) {
        return {
            score: 20,
            label: "Active Community",
        }
    }

    if (total >= 5) {
        return {
            score: 15,
            label: "Collaborative",
        }
    }

    if (total >=2) {
        return {
            score: 10,
            label: "Small Team",
        }
    }

    if (total >=1) {
        return {
            score: 5,
            label: "Solo Maintainer",
        }
    }
    
    return {
        score : 0,
        label : "No Contributors",
    }
}

function calculateActivity(
    repository : GitHubRepository,
) : AnalysisResult {
    
    const updatedDate = new Date(repository.updated_at);

    const today = new Date();

    const difference = today.getTime() - updatedDate.getTime();

    const days = difference / (1000 * 60 * 60 * 24);

    if (days <= 30) {
        return {
            score : 20,
            label : "Very active",
        }
    }
    
    if (days <= 100) {
        return {
            score : 10,
            label : "Active",
        }
    }

    if (days <= 365) {
        return {
            score : 15,
            label : "less active",
        }
    }

    return {
        score : 5,
        label : "Inactive",
    }
}

function calculateMaintenance(
    repository : GitHubRepository,
) : AnalysisResult {

    const issue = repository.open_issues_count

    if (issue >= 50) {
        return {
            score : 0,
            label : "Unmaintained",
        }
    }

    if (issue >= 20) {
        return {
            score : 5,
            label : "Needs Attention",
        }
    }

    if (issue >= 10) {
        return {
            score : 10,
            label : "Average",
        }
    }

    if (issue >=5) {
        return {
            score : 15,
            label : "Well Kept",
        }
    }

    return {
        score : 20,
        label : "Well maintained",
    }
}



export default function analyzeRepository(
    repository : GitHubRepository,
    contributors : GitHubContributor[],
    readme : string,
 ) : RepositoryAnalysis {

    const documentation = calculateDocumentation(readme);
    const popularity = calculatePopularity(repository);
    const community = calculateCommunity(contributors);
    const maintenance = calculateMaintenance(repository);
    const activity = calculateActivity(repository);
    const score =
        documentation.score +
        popularity.score +
        community.score +
        maintenance.score +
        activity.score;

    return{

        score,

        documentation : documentation.label,

        popularity : popularity.label,

        maintenance : maintenance.label,

        activity : activity.label,

        community : community.label,
    };
}