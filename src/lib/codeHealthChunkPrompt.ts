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
      "category": "codeQuality",
      "finding": "Short concrete observation",
      "severity": "medium",
      "files": ["src/example.ts"]
    }
  ]
}

STRICT CATEGORY RULES:
category MUST be exactly one of:
- architecture
- maintainability
- codeQuality
- testing
- security
- typeSafety
- documentation

FIELD CONSTRAINTS & RULES:
- Return an empty observations array if there are no valid observations.
- Never invent a category.
- Never combine multiple categories into one string.
- Never use spaces or natural-language variants such as "code quality".
- Every observation MUST contain all four required fields: category, finding, severity, and files.
- finding MUST be a non-empty string under 200 characters.
- severity MUST be exactly one of: "high", "medium", "low".
- Maximum 8 observations per chunk.
- Only report evidence visible in the supplied files.
- Do not invent missing files, tests, dependencies, or behavior.
- Do not give an overall score or recommendations.
- Return ONLY the JSON object without markdown formatting.

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