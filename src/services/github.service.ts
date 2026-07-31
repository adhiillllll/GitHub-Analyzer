import axios from "axios";
import { GitHubRepository,GitHubLanguages,GitHubContributor } from "@/types/github";

const githubApi = axios.create({
    baseURL:'https://api.github.com',
})


export async function getRepository(
    owner:string,
    repo:string
):Promise<GitHubRepository> {
    
    const response = await githubApi.get<GitHubRepository>(`/repos/${owner}/${repo}`);

    return response.data;
    
}


export async function getRepositoryLanguages(
    owner:string,
    repo:string
):Promise<GitHubLanguages> {

    const response = await githubApi.get<GitHubLanguages>(`/repos/${owner}/${repo}/languages`);

    return response.data;
}


export async function getRepositoryContributors(
    owner : string,
    repo : string
) : Promise<GitHubContributor[]>{

    const response = await githubApi.get<GitHubContributor[]>(`/repos/${owner}/${repo}/contributors`);

    return response.data;  
}