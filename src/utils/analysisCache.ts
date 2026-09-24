import { GitHubRepository, GitHubLanguages, GitHubContributor, RepositoryAnalysis } from "@/types/github";
import { CodeHealthResult } from "@/types/codeHealth";

export interface CachedAnalysis {
  repository: GitHubRepository;
  languages: GitHubLanguages;
  contributors: GitHubContributor[];
  readme: string;
  analysis: RepositoryAnalysis;
  codeHealth?: CodeHealthResult | null;
  timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes (300,000 ms)

const memoryCache = new Map<string, CachedAnalysis>();

/**
 * Returns a valid (non-expired) cached analysis result for the given owner/repo key,
 * or null if no valid entry exists.
 */
export function getCachedAnalysis(owner: string, repo: string): CachedAnalysis | null {
  const key = `${owner}/${repo}`.toLowerCase();
  const entry = memoryCache.get(key);

  if (!entry) {
    return null;
  }

  const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;
  if (isExpired) {
    memoryCache.delete(key);
    return null;
  }

  return entry;
}

/**
 * Saves a successful repository analysis result in the client cache.
 */
export function setCachedAnalysis(
  owner: string,
  repo: string,
  data: Omit<CachedAnalysis, "timestamp">
): void {
  const key = `${owner}/${repo}`.toLowerCase();
  memoryCache.set(key, {
    ...data,
    timestamp: Date.now(),
  });
}

/**
 * Updates an existing cached entry with the generated Code Health analysis result.
 */
export function updateCachedCodeHealth(
  owner: string,
  repo: string,
  codeHealth: CodeHealthResult | null
): void {
  const key = `${owner}/${repo}`.toLowerCase();
  const entry = memoryCache.get(key);
  if (entry) {
    entry.codeHealth = codeHealth;
  }
}

/**
 * Clears all cached repository analysis results.
 */
export function clearAnalysisCache(): void {
  memoryCache.clear();
}
