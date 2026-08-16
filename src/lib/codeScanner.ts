import { GitHubTreeItem, GitHubTreeResponse } from "@/types/github";
import { getRawRepositoryFile } from "@/services/github.service";

export type ScannedFile = {
    path: string;
    content: string;
    size: number;
};

type ScanOptions = {
    maxFiles?: number;
    maxFileSize?: number;
    maxTotalSize?: number;
}

const DEFAULT_OPTIONS: Required<ScanOptions> = {
    maxFiles: 30,
    maxFileSize: 100_000,
    maxTotalSize: 1_000_000,
};

const IGNORED_DIRECTORIES = [
    "node_modules",
    ".git",
    ".next",
    ".nuxt",
    ".output",
    "dist",
    "build",
    "coverage",
    "vendor",
    "target",
    "bin",
    "obj",
    ".cache",
    ".turbo",
    ".vercel",
];

const IGNORED_FILE_NAMES = [
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    ".env.test",

    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "bun.lockb",

    "composer.lock",
    "Gemfile.lock",
    "Cargo.lock",
];

const IGNORED_EXTENSIONS = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".ico",
    ".svg",
    ".mp3",
    ".wav",
    ".mp4",
    ".mov",
    ".avi",
    ".webm",
    ".zip",
    ".rar",
    ".7z",
    ".tar",
    ".gz",
    ".pdf",
    ".exe",
    ".dll",
    ".so",
    ".dylib",
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",
    ".eot",
];

const HIGH_PRIORITY_FILES = [
    "README.md",
    "readme.md",
    "Dockerfile",
    "docker-compose.yml",
    "docker-compose.yaml",
    "Makefile",
    "CMakeLists.txt",
    "go.mod",
    "go.sum",
    "Cargo.toml",
    "pom.xml",
    "build.gradle",
    "build.gradle.kts",
    "requirements.txt",
    "pyproject.toml",
    "composer.json",
    "Gemfile",
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
    "vite.config.js",
    "next.config.js",
    "next.config.ts",
    "angular.json",
];

const SUPPORTED_TEXT_EXTENSIONS = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".mjs",
    ".cjs",

    ".py",

    ".java",
    ".kt",
    ".kts",
    ".scala",

    ".c",
    ".h",
    ".cpp",
    ".cc",
    ".cxx",
    ".hpp",
    ".cs",

    ".go",
    ".rs",

    ".php",
    ".rb",

    ".swift",
    ".dart",

    ".html",
    ".css",
    ".scss",
    ".sass",
    ".less",
    ".vue",
    ".svelte",

    ".sh",
    ".bash",
    ".zsh",
    ".fish",
    ".ps1",

    ".json",
    ".yaml",
    ".yml",
    ".toml",
    ".xml",
    ".ini",
    ".conf",

    ".md",
    ".mdx",

]

function normalizePath(path: string): string {
    return path.replace(/\\/g, "/");
}

function getFileName(path: string): string {
    const normalized = normalizePath(path);
    return normalized.split("/").pop() ?? normalized;
}

function getExtension(path: string): string {
    const fileName = getFileName(path);
    const dotIndex = fileName.lastIndexOf(".");

    if (dotIndex === -1) {
        return "";
    }

    return fileName.slice(dotIndex).toLowerCase();
}

function isIgnoredPath(path: string): boolean {
    const normalized = normalizePath(path);
    const segments = normalized.split("/");

    if (
        segments.some((segment) =>
            IGNORED_DIRECTORIES.includes(segment)
        )
    ) {
        return true;
    }

    const fileName = getFileName(normalized);

    if (IGNORED_FILE_NAMES.includes(fileName)) {
        return true;
    }

    const extension = getExtension(normalized);

    if (IGNORED_EXTENSIONS.includes(extension)) {
        return true;
    }

    return false;
}


function getPriority(item: GitHubTreeItem): number {
    const fileName = getFileName(item.path);
    const path = normalizePath(item.path);

    if (HIGH_PRIORITY_FILES.includes(fileName)) {
        return 100;
    }

    if (
        path.includes("/src/") ||
        path.startsWith("src/")
    ) {
        return 80;
    }

    if (
        path.includes("/app/") ||
        path.startsWith("app/")
    ) {
        return 75;
    }

    if (
        path.includes("/lib/") ||
        path.startsWith("lib/")
    ) {
        return 70;
    }

    if (
        path.includes("/components/") ||
        path.includes("/services/")
    ) {
        return 65;
    }

    if (
        path.includes("/test/") ||
        path.includes("/tests/") ||
        path.includes("__tests__")
    ) {
        return 55;
    }

    return 40;
}

function isSourceFile(item: GitHubTreeItem): boolean {
    if (item.type !== "blob") {
        return false;
    }

    if (isIgnoredPath(item.path)) {
        return false;
    }

    const extension = getExtension(item.path);

    return SUPPORTED_TEXT_EXTENSIONS.includes(extension);
}

function isHighPriorityFile(item: GitHubTreeItem): boolean {
    if (item.type !== "blob") {
        return false;
    }

    if (isIgnoredPath(item.path)) {
        return false;
    }

    const fileName = getFileName(item.path);

    return HIGH_PRIORITY_FILES.includes(fileName);
}

export async function scanRepositoryFiles(
    owner: string,
    repo: string,
    branch: string,
    tree: GitHubTreeResponse,
    options: ScanOptions = {}
): Promise<ScannedFile[]> {

    const config = {
        ...DEFAULT_OPTIONS,
        ...options,
    };

    const architectureFiles = tree.tree
        .filter(isHighPriorityFile)
        .sort((a, b) => getPriority(b) - getPriority(a));

    const sourceFiles = tree.tree
        .filter(isSourceFile)
        .filter((item) => !isHighPriorityFile(item))
        .sort((a, b) => getPriority(b) - getPriority(a));

    const architectureLimit = Math.min(2, config.maxFiles);

    const sourceLimit = Math.max(
        0,
        config.maxFiles - architectureLimit
    );

    const candidates = [
        ...architectureFiles.slice(0, architectureLimit),
        ...sourceFiles.slice(0, sourceLimit),
    ];

    const selectedFiles: ScannedFile[] = [];

    let totalSize = 0;

    for (const item of candidates) {

        if (selectedFiles.length >= config.maxFiles) {
            break;
        }

        const fileSize = item.size ?? 0;

        if (fileSize > config.maxFileSize) {
            continue;
        }

        if (
            totalSize + fileSize >
            config.maxTotalSize
        ) {
            continue;
        }

        try {

            const content = await getRawRepositoryFile(
                owner,
                repo,
                branch,
                item.path
            );

            if (!content.trim()) {
                continue;
            }

            selectedFiles.push({
                path: item.path,
                content,
                size: content.length,
            });

            totalSize += content.length;

        } catch (error) {

            console.warn(
                `Could not read repository file: ${item.path}`,
                error
            );
        }
    }

    return selectedFiles;
}