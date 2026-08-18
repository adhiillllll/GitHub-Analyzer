import { ScannedFile } from "@/lib/codeScanner";

// Target chunk size set to ~24,000 characters (~5,500 tokens)
// with max single file cap of 12,000 characters to achieve:
// - Small repos: 1–3 chunks
// - 15-file repos: 3–5 chunks
// - 30-file repos: 5–8 chunks
const MAX_CHUNK_CHARS = 24_000;
const MAX_SINGLE_FILE_CHARS = 12_000;

// Low-value asset, log, or minified files to skip from chunk budget
const IGNORED_EXTENSIONS = new Set([
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf", ".eot",
    ".min.js", ".min.css", ".map", ".log"
]);

const IGNORED_FILENAMES = new Set([
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "cargo.lock", "gemfile.lock", "composer.lock"
]);

function shouldSkipFile(filePath: string): boolean {
    const lower = filePath.toLowerCase();
    const basename = lower.split("/").pop() || lower;
    if (IGNORED_FILENAMES.has(basename)) return true;
    for (const ext of IGNORED_EXTENSIONS) {
        if (lower.endsWith(ext)) return true;
    }
    return false;
}

function truncateFileContent(content: string, maxChars: number): string {
    if (content.length <= maxChars) return content;
    return content.slice(0, maxChars) + "\n// [...remaining content truncated for code health analysis...]";
}

export function chunkCodeFiles(
    files: ScannedFile[]
): ScannedFile[][] {
    const filteredFiles = files.filter((f) => !shouldSkipFile(f.path));
    const targetFiles = filteredFiles.length > 0 ? filteredFiles : files;

    const chunks: ScannedFile[][] = [];
    let currentChunk: ScannedFile[] = [];
    let currentSize = 0;

    const flushChunk = () => {
        if (currentChunk.length > 0) {
            chunks.push(currentChunk);
            currentChunk = [];
            currentSize = 0;
        }
    };

    for (const file of targetFiles) {
        const truncatedContent = truncateFileContent(file.content, MAX_SINGLE_FILE_CHARS);
        const fileObj: ScannedFile = {
            ...file,
            content: truncatedContent,
            size: truncatedContent.length,
        };

        if (currentSize + fileObj.content.length > MAX_CHUNK_CHARS && currentChunk.length > 0) {
            flushChunk();
        }

        currentChunk.push(fileObj);
        currentSize += fileObj.content.length;
    }

    flushChunk();

    return chunks;
}