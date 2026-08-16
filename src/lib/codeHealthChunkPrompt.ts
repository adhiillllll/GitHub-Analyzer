type CodeHealthChunkPromptInput = {
    repositoryName: string;
    chunkIndex: number;
    totalChunks: number;
    files: {
        path: string;
        content: string;
    }[];
};

export function buildCodeHealthChunkPrompt({
    repositoryName,
    chunkIndex,
    totalChunks,
    files,
}: CodeHealthChunkPromptInput): string {
    return `
You are analyzing part ${chunkIndex} of ${totalChunks} of the repository:

${repositoryName}

Review ONLY the supplied source files.

Return ONLY valid JSON.

Use exactly this structure:

{
  "observations": [
    {
      "category": "architecture | maintainability | codeQuality | testing | security | typeSafety | documentation",
      "finding": "short concrete observation",
      "severity": "high | medium | low",
      "files": ["path/to/file"]
    }
  ]
}

Rules:
- Maximum 8 observations.
- Keep each finding under 200 characters.
- Only report evidence visible in the supplied files.
- Do not invent missing files, tests, dependencies, or behavior.
- Do not give an overall score.
- Do not provide recommendations.
- Do not write markdown.

- Every observation MUST contain all four fields:
- category
- finding
- severity
- files

"finding" must always be a non-empty string.

If you cannot identify a finding for an observation, do not create that observation.

Return ONLY the JSON object.
Do not omit fields.

Files:

${files
    .map(
        (file) => `
FILE: ${file.path}

${file.content}
`
    )
    .join("\n")}
`;
}