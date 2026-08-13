export type CodeHealthSeverity = "high" | "medium" | "low";

export type CodeHealthCategory = {
  score: number;
  summary: string;
};

export type CodeHealthIssue = {
  severity: CodeHealthSeverity;
  title: string;
  description: string;
  files?: string[];
};

export type CodeHealthRecommendation = {
  priority: CodeHealthSeverity;
  title: string;
  description: string;
};

export type CodeHealthResult = {
  overallScore: number;

  categories: {
    architecture: CodeHealthCategory;
    maintainability: CodeHealthCategory;
    codeQuality: CodeHealthCategory;
    testing: CodeHealthCategory;
    security: CodeHealthCategory;
    typeSafety: CodeHealthCategory;
    documentation: CodeHealthCategory;
  };

  strengths: string[];

  issues: CodeHealthIssue[];

  recommendations: CodeHealthRecommendation[];
};