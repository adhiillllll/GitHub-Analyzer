
type ValidationResult = {
    valid: boolean;
    owner: string | null;
    repo: string | null;
    error?: string;
}

export default function validateGithubUrl(url: string): ValidationResult {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
        return {
            valid: false,
            owner: null,
            repo: null,
            error: "Please enter a GitHub repository URL.",
        };
    }

    let formattedUrl = trimmedUrl;
    if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
    }

    try {
        const parsedUrl = new URL(formattedUrl);
        const hostname = parsedUrl.hostname.toLowerCase();

        if (hostname !== "github.com" && hostname !== "www.github.com") {
            return {
                valid: false,
                owner: null,
                repo: null,
                error: "Invalid GitHub URL. Please enter a valid github.com repository link.",
            };
        }

        const paths = parsedUrl.pathname
            .split("/")
            .filter(Boolean);

        if (paths.length < 2) {
            return {
                valid: false,
                owner: null,
                repo: null,
                error: "Please enter a complete repository URL including owner and repository name (e.g., https://github.com/owner/repository).",
            };
        }

        const owner = paths[0];
        const repo = paths[1].replace(/\.git$/i, "");

        if (!owner || !repo) {
            return {
                valid: false,
                owner: null,
                repo: null,
                error: "Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repository).",
            };
        }

        return {
            valid: true,
            owner,
            repo,
        };
    } catch {
        return {
            valid: false,
            owner: null,
            repo: null,
            error: "Invalid URL format. Please enter a valid URL (e.g., https://github.com/owner/repository).",
        };
    }
}

    
