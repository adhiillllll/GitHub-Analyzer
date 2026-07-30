import axios from "axios";
import { GitHubRepository,GitHubLanguages } from "@/types/github";

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