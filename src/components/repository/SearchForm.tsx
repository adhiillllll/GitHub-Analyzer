'use client'

import Input from "../ui/Input"
import Button from "../ui/Button"
import { useState } from "react"
import validateGithubUrl from "@/validators/github.validator"
import { GitHubRepository, GitHubLanguages, GitHubContributor, RepositoryAnalysis } from "@/types/github"
import { getRepository, getRepositoryLanguages, getRepositoryContributors, getRepositoryReadme } from "@/services/github.service"
import RepositoryCard from "./RepositoryCard";
import { decodeBase64 } from "@/utils/decodeBase64"
import analyzeRepository from "@/lib/repositoryAnalyzer"
import AnalysisCard from "./AnalysisCard"
import ReactMarkdown from "react-markdown";


export default function SearchForm() {

  const [url, setUrl] = useState("")
  const [repository, setRepository] = useState<GitHubRepository | null>(null);
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState<GitHubLanguages>({})
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);
  const [readme, setReadme] = useState("");
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerateSummary = async () => {

    if (!repository || !analysis)
      return;

    try {

      setAiLoading(true);

      const response = await fetch("/api/ai", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          repository,
          languages,
          contributors,
          readme,
          analysis,
        }),

      });

      const data = await response.json();

      setAiSummary(data.summary);

    } catch (error) {

      console.error(error);

    } finally {

      setAiLoading(false);

    }

  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError("");

    setRepository(null);
    setLanguages({});
    setContributors([]);
    setReadme("");
    setAnalysis(null);
    setAiSummary("");

    const result = validateGithubUrl(url.trim())

    if (!result.valid) {
      setError(result.error ?? "Invalid URL");
      return;
    }
    setLoading(true)

    try {
      const [repositoryData, languageData, contributorData] =
        await Promise.all([
          getRepository(result.owner!, result.repo!),
          getRepositoryLanguages(result.owner!, result.repo!),
          getRepositoryContributors(result.owner!, result.repo!),
        ]);

      let decodedReadme = "";

      try {
        const readmeData = await getRepositoryReadme(
          result.owner!,
          result.repo!,)

        decodedReadme = decodeBase64(readmeData.content);

      } catch {

        console.log("Repository has no README.");

      }

      const repositoryAnalysis = analyzeRepository(
        repositoryData,
        contributorData,
        decodedReadme
      )

      setRepository(repositoryData);
      setLanguages(languageData);
      setContributors(contributorData);
      setReadme(decodedReadme)
      setAnalysis(repositoryAnalysis);

    } catch (error) {
      setRepository(null);
      setLanguages({});
      setContributors([]);
      setReadme("");
      setAnalysis(null)

      setError("Failed to analyze repository.");

      console.error(error);

    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

      <h1 className="text-3xl font-bold text-white">
        GitHub Project Reviewer
      </h1>

      <p className="mt-3 text-slate-400">
        Paste any public GitHub Repository URL to analyze it's structure,
        technologies and project health.
      </p>

      <div className="mt-8">

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="GitHub URL" value={url}
            onChange={(e) => {
              const value = e.target.value;

              setUrl(value);

              if (!value.trim()) {
                setRepository(null);
                setLanguages({})
                setContributors([]);
                setReadme("");
                setAnalysis(null)
                setAiSummary("");
                setError("");
              }
            }} />

          <Button type="submit" disabled={loading || !url.trim()}>
            {loading ? "Analyzing..." : "Analyze"}
          </Button>

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          {repository && (
            <RepositoryCard
              repository={repository}
              languages={languages}
              contributors={contributors}
              readme={readme} />
          )}

          {analysis && (
            <AnalysisCard
              analysis={analysis} />
          )}

          <button onClick={handleGenerateSummary}
            disabled={aiLoading || !repository}>
            {aiLoading ? "🤖 Thinking..." : "🤖 Generate AI Summary"}
          </button>

          {aiSummary && (

            <div className="mt-6 rounded-lg border border-slate-700 bg-slate-900 p-6">

              <h2 className="text-xl font-bold">
                AI Summary
              </h2>

              <div className="prose prose-invert max-w-none mt-4 max-h-[500px] overflow-y-auto">
                <ReactMarkdown>
                  {aiSummary}
                </ReactMarkdown>
              </div>

            </div>
          )}

        </form>

      </div>

    </section>
  )
}