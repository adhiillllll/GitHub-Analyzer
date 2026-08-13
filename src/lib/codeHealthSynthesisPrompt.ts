type CodeHealthSynthesisInput = {
    repositoryName: string;
    chunkResults: unknown[];
};

export function buildCodeHealthSynthesisPrompt({
    repositoryName,
    chunkResults,
}: CodeHealthSynthesisInput): string {

    return `
You are RepoLens, an expert senior software engineer.

You are producing the FINAL code-health assessment for:

${repositoryName}

Several independent analysis passes were performed on different portions
of the repository.

Your job is to synthesize those findings into ONE reliable repository-level
assessment.

IMPORTANT:

- Do not invent evidence.
- Do not claim to have inspected files that were not represented in the findings.
- Resolve duplicate findings.
- Prefer concrete evidence over generic advice.
- Do not automatically average scores.
- Use your engineering judgment to produce a coherent overall assessment.
- If the evidence is incomplete, explicitly acknowledge that.
- Keep recommendations actionable.
- Do not expose secrets.

Return ONLY valid JSON.

The JSON MUST exactly follow this structure:

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
- Never omit "title".
- Only mention files appearing in the supplied analysis.
- Do not manufacture missing evidence.

Chunk analysis results:

${JSON.stringify(chunkResults, null, 2)}
`;
}