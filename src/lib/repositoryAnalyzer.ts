import { GitHubRepository , RepositoryAnalysis , GitHubContributor, AnalysisResult } from "@/types/github";


function calculateDocumentation(
    readme : string,
) : AnalysisResult {

    if (readme.trim().length > 0) {
        return {
            score : 20,
            label : "Excellent",
        }
    }

    return   {
        score : 0,
        label : "Missing README",
    }; 
}


function calculatePopularity(
    repository : GitHubRepository,
) : AnalysisResult {
    
    const star = repository.stargazers_count;

    if (star >= 1000) {
        return {
            score : 20,
            label : "Excellent",
        }
    }

    if (star >= 100) {
        return {
            score : 15,
            label : "Good",
        }
    }

    if (star >= 10) {
        return {
            score : 10,
            label : "Average",
        }
    }

    return {
        score : 5,
        label : "Beginner",
    }
}


function calculateCommunity(
    contributors : GitHubContributor[],
) : AnalysisResult {

    const total = contributors.length

    if (total >= 10) {
        return {
            score: 20,
            label: "Excellent",
        }
    }

    if (total >= 5) {
        return {
            score: 15,
            label: "Good",
        }
    }

    if (total >=2) {
        return {
            score: 10,
            label: "Average",
        }
    }

    if (total >=1) {
        return {
            score: 5,
            label: "Small Community",
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

    if (days >= 30) {
        return {
            score : 20,
            label : "Very active",
        }
    }
    
    if (days >= 100) {
        return {
            score : 10,
            label : "Active",
        }
    }

    if (days >= 365) {
        return {
            score : 15,
            label : "Average",
        }
    }

    return {
        score : 5,
        label : "Interactive",
    }
}

function calculateMaintenance(
    repository : GitHubRepository,
) : AnalysisResult {

    const issue = repository.open_issues_count

    if (issue >= 50) {
        return {
            score : 0,
            label : "Less maintained",
        }
    }

    if (issue >= 20) {
        return {
            score : 5,
            label : "Poor",
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
            label : "Good",
        }
    }

    return {
        score : 20,
        label : "Excellent",
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