type CodeHealthGroupPromptInput = {
    repositoryName: string;
    chunkResults: unknown[];
};

export function buildCodeHealthGroupPrompt({
    repositoryName,
    chunkResults,
}: CodeHealthGroupPromptInput): string {
    return `
You are RepoLens, a senior software engineer.

You are reviewing a group of code-analysis observations from:

${repositoryName}

Create a compact evidence summary for a later final analysis.

Do NOT calculate an overall score.

Do NOT invent evidence.

Return ONLY valid JSON.

Use exactly this structure:

{
  "observations": [
    {
      "category": "architecture | maintainability | codeQuality | testing | security | typeSafety | documentation",
      "finding": "short concrete finding",
      "severity": "high | medium | low",
      "files": ["path/to/file"]
    }
  ]
}

Rules:

- Combine duplicate observations.
- Maximum 12 observations.
- Keep each finding concise.
- Preserve important high-severity findings.
- Only mention files present in the supplied observations.
- Do not invent files or behavior.
- Do not provide scores.
- Do not provide recommendations.
- Do not write markdown.
- Return JSON only.

Input observations:

${JSON.stringify(chunkResults)}
`;
}