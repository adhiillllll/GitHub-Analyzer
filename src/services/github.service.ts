import "server-only";
import axios from "axios";
import { GitHubRepository, GitHubLanguages, GitHubContributor, GitHubReadme, GitHubTreeResponse, GitHubFileContent } from "@/types/github";

const githubApi = axios.create({
    baseURL: "https://api.github.com",
    headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
    },
});


export async function getRepository(
    owner: string,
    repo: string
): Promise<GitHubRepository> {

    const response = await githubApi.get<GitHubRepository>(`/repos/${owner}/${repo}`);

    return response.data;

}


export async function getRepositoryLanguages(
    owner: string,
    repo: string
): Promise<GitHubLanguages> {

    const response = await githubApi.get<GitHubLanguages>(`/repos/${owner}/${repo}/languages`);

    return response.data;
}


export async function getRepositoryContributors(
    owner: string,
    repo: string
): Promise<GitHubContributor[]> {

    const response = await githubApi.get<GitHubContributor[]>(`/repos/${owner}/${repo}/contributors`);

    return response.data;
}


export async function getRepositoryReadme(
    owner: string,
    repo: string
): Promise<GitHubReadme> {

    const response = await githubApi.get<GitHubReadme>(`/repos/${owner}/${repo}/readme`);

    return response.data;
}


export async function getRepositoryTree(
    owner: string,
    repo: string,
    branch: string
): Promise<GitHubTreeResponse> {

    const response = await githubApi.get<GitHubTreeResponse>(
        `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`
    );

    return response.data;
}


export async function getRepositoryFile(
    owner: string,
    repo: string,
    path: string
): Promise<GitHubFileContent> {

    const response = await githubApi.get<GitHubFileContent>(
        `/repos/${owner}/${repo}/contents/${path}`
    );

    return response.data;
}


export async function getRawRepositoryFile(
    owner: string,
    repo: string,
    branch: string,
    path: string
): Promise<string> {

    const rawUrl =
        `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(branch)}/${path
            .split("/")
            .map(encodeURIComponent)
            .join("/")}`;

    const response = await fetch(rawUrl);

    if (!response.ok) {
        throw new Error(
            `Failed to fetch raw file: ${path} (${response.status})`
        );
    }

    return response.text();
}