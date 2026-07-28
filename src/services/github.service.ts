import axios from "axios";
import { GitHubRepository } from "@/types/github";

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