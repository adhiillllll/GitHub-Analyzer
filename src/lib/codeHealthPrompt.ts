import { ScannedFile } from "@/lib/codeScanner";

type CodeHealthPromptInput = {
    repositoryName: string;
    languages: Record<string, number>;
    files: ScannedFile[];
};

export function buildCodeHealthPrompt({
    repositoryName,
    languages,
    files,
}: CodeHealthPromptInput): string {

    const languageSummary = Object.entries(languages)
        .map(([language, bytes]) => `${language}: ${bytes} bytes`)
        .join("\n");

    const sourceFiles = files
        .map(
            (file) =>
                `\n===== FILE: ${file.path} =====\n${file.content}`
        )
        .join("\n");

    return `
You are RepoLens, an expert software engineer performing a code-health review.

Repository:
${repositoryName}

Detected languages:
${languageSummary || "Not available"}

You are reviewing ONE CHUNK of the repository.

IMPORTANT:

- Analyze ONLY the files provided below.
- Do not claim that you inspected files that are not provided.
- Do not invent findings.
- Do not assume that something does not exist simply because it is not present in this chunk.
- Focus on evidence visible in these files.
- Identify relationships between files when the provided files support that conclusion.
- If evidence is insufficient, say so.
- Do not expose secrets if they accidentally appear.

Return ONLY valid JSON.

Return this structure:

{
  "overallScore": number,

  "categories": {
    "architecture": {
      "score": number,
      "summary": string
    },
    "maintainability": {
      "score": number,
      "summary": string
    },
    "codeQuality": {
      "score": number,
      "summary": string
    },
    "testing": {
      "score": number,
      "summary": string
    },
    "security": {
      "score": number,
      "summary": string
    },
    "typeSafety": {
      "score": number,
      "summary": string
    },
    "documentation": {
      "score": number,
      "summary": string
    }
  },

  "strengths": ["string"],

  "issues": [
    {
      "severity": "high | medium | low",
      "title": "string",
      "description": "string",
      "files": ["string"]
    }
  ],

  "recommendations": [
    {
      "priority": "high | medium | low",
      "title": "string",
      "description": "string"
    }
  ]
}

Rules:

- Scores must be integers from 0 to 100.
- Never use "file". Use "files".
- Never omit "title" from an issue.
- Only reference files actually provided in this chunk.
- If evidence is insufficient, explicitly say:
  "Insufficient evidence from the scanned files."

Repository files:

${sourceFiles}
`;
}