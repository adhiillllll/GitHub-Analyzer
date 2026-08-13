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
  // watchers_count: number;
  size : number;
  default_branch: string;
  created_at: string;
  updated_at: string;
  license: {
    key: string;
    name: string;
  } | null;
  topics : string[];
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


export interface GitHubReadme {
  content : string;
  encoding : string;
}


export interface RepositoryAnalysis {
  score : number;
  documentation : string;
  popularity : string;
  maintenance : string;
  activity : string;
  community : string;

}

export interface AnalysisResult {
    score: number;
    label: string;
}

export type GitHubTreeItem = {
    path: string;
    mode: string;
    type: "blob" | "tree";
    sha: string;
    size?: number;
    url: string;
};

export type GitHubTreeResponse = {
    sha: string;
    url: string;
    tree: GitHubTreeItem[];
    truncated: boolean;
};

export type GitHubFileContent = {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string | null;
    type: "file";
    content: string;
    encoding: string;
};