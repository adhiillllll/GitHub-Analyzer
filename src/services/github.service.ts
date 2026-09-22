import "server-only";
import axios from "axios";
import { GitHubRepository, GitHubLanguages, GitHubContributor, GitHubReadme, GitHubTreeResponse, GitHubFileContent } from "@/types/github";

const githubApi = axios.create({
    baseURL: "https://api.github.com",
    headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
        "X-GitHub-Api-Version": "2022-11-28",
    },
});

async function safeGithubGet<T>(url: string): Promise<T> {
    try {
        const response = await githubApi.get<T>(url);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            // If authenticated request receives 401 (e.g. invalid or expired GITHUB_TOKEN),
            // retry this specific request once without the Authorization header.
            const unauthResponse = await githubApi.get<T>(url, {
                headers: {
                    Authorization: undefined,
                },
            });
            return unauthResponse.data;
        }
        throw error;
    }
}


export async function getRepository(
    owner: string,
    repo: string
): Promise<GitHubRepository> {
    return safeGithubGet<GitHubRepository>(`/repos/${owner}/${repo}`);
}


export async function getRepositoryLanguages(
    owner: string,
    repo: string
): Promise<GitHubLanguages> {
    return safeGithubGet<GitHubLanguages>(`/repos/${owner}/${repo}/languages`);
}


export async function getRepositoryContributors(
    owner: string,
    repo: string
): Promise<GitHubContributor[]> {
    return safeGithubGet<GitHubContributor[]>(`/repos/${owner}/${repo}/contributors`);
}


export async function getRepositoryReadme(
    owner: string,
    repo: string
): Promise<GitHubReadme> {
    return safeGithubGet<GitHubReadme>(`/repos/${owner}/${repo}/readme`);
}


export async function getRepositoryTree(
    owner: string,
    repo: string,
    branch: string
): Promise<GitHubTreeResponse> {
    return safeGithubGet<GitHubTreeResponse>(
        `/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`
    );
}


export async function getRepositoryFile(
    owner: string,
    repo: string,
    path: string
): Promise<GitHubFileContent> {
    return safeGithubGet<GitHubFileContent>(
        `/repos/${owner}/${repo}/contents/${path}`
    );
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

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        attempts++;
        try {
            const response = await fetch(rawUrl);

            if (response.ok) {
                return await response.text();
            }

            // Permanent 404 error - do NOT retry repeatedly
            if (response.status === 404) {
                throw new Error(`Failed to fetch raw file: ${path} (404)`);
            }

            // Transient HTTP error (e.g. 502, 503, 504)
            if (attempts < maxAttempts) {
                const backoffMs = attempts === 1 ? 500 : 1000;
                await new Promise((resolve) => setTimeout(resolve, backoffMs));
                continue;
            }

            throw new Error(`Failed to fetch raw file: ${path} (${response.status})`);
        } catch (err: unknown) {
            const is404 = err instanceof Error && err.message.includes("(404)");
            if (is404 || attempts >= maxAttempts) {
                throw err;
            }
            const backoffMs = attempts === 1 ? 500 : 1000;
            await new Promise((resolve) => setTimeout(resolve, backoffMs));
        }
    }

    throw new Error(`Failed to fetch raw file: ${path}`);
}