export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  html_url: string;
  watchers_count: number;
  default_branch: string;
  created_at: string;
  updated_at: string;
  license: {
    key: string;
    name: string;
  } | null;
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface GitHubContributor {
  id: number;
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}