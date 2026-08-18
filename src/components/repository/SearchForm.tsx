'use client'

import { useState } from "react"
import validateGithubUrl from "@/validators/github.validator"
import { GitHubRepository, GitHubLanguages, GitHubContributor, RepositoryAnalysis } from "@/types/github"
import RepositoryCard from "./RepositoryCard"
import Sidebar from "./Sidebar"
import Navbar from "../layout/Navbar"
import LogoSection from "../home/LogoSection"
import RepoUrlForm from "../home/RepoUrlForm"
import RecentAnalysis from "../home/RecentAnalysis"
import { decodeBase64 } from "@/utils/decodeBase64"
import analyzeRepository from "@/lib/repositoryAnalyzer"
import { CodeHealthResult } from "@/types/codeHealth"

export default function SearchForm() {
  const [url, setUrl] = useState("")
  const [repository, setRepository] = useState<GitHubRepository | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [languages, setLanguages] = useState<GitHubLanguages>({})
  const [contributors, setContributors] = useState<GitHubContributor[]>([])
  const [readme, setReadme] = useState("")
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null)
  const [aiSummary, setAiSummary] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [sidebarTab, setSidebarTab] = useState("Summary")
  const [codeHealth, setCodeHealth] = useState<CodeHealthResult | null>(null)
  const [codeHealthLoading, setCodeHealthLoading] = useState(false)
  const [codeHealthError, setCodeHealthError] = useState<string | null>(null)

  const generateCodeHealth = async (
    owner: string,
    repo: string,
    branch: string
  ) => {
    try {
      setCodeHealthLoading(true);
      setCodeHealthError(null);
      setCodeHealth(null);

      const response = await fetch("/api/code-health", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner,
          repo,
          branch,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate code health");
      }

      setCodeHealth(data.codeHealth);
    } catch (error) {
      console.error("Code Health error:", error);
      setCodeHealth(null);
      setCodeHealthError(error instanceof Error ? error.message : "Failed to analyze code health.");
    } finally {
      setCodeHealthLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!repository || !analysis) return

    try {
      setAiLoading(true)
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
      })

      const data = await response.json()
      setAiSummary(data.summary)
    } catch (err) {
      console.error(err)
    } finally {
      setAiLoading(false)
    }
  }

  const fetchRepoData = async (targetUrl: string) => {
    setError("")
    setRepository(null)
    setLanguages({})
    setContributors([])
    setReadme("")
    setAnalysis(null)
    setAiSummary("")
    setCodeHealth(null)
    setCodeHealthLoading(false)

    const result = validateGithubUrl(targetUrl.trim())

    if (!result.valid) {
      setError(result.error ?? "Invalid URL")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/github", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner: result.owner,
          repo: result.repo,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to fetch repository.");
      }

      const repositoryData = data.repository;
      const languageData = data.languages;
      const contributorData = data.contributors;

      let decodedReadme = "";

      if (data.readme) {
        try {
          decodedReadme = decodeBase64(data.readme);
        } catch {
          console.log("Could not decode README.");
        }
      }

      const repositoryAnalysis = analyzeRepository(
        repositoryData,
        contributorData,
        decodedReadme
      )

      setRepository(repositoryData)
      setLanguages(languageData)
      setContributors(contributorData)
      setReadme(decodedReadme)
      setAnalysis(repositoryAnalysis)

      if (result.owner && result.repo) {
        generateCodeHealth(
          result.owner,
          result.repo,
          repositoryData.default_branch
        )
      }

    } catch (err) {
      setRepository(null)
      setLanguages({})
      setContributors([])
      setReadme("")
      setAnalysis(null)
      setError("Failed to analyze repository.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchRepoData(url)
  }

  const handleSelectRecentRepo = (selectedUrl: string) => {
    setUrl(selectedUrl)
    fetchRepoData(selectedUrl)
  }

  const handleResetAnalysis = () => {
    setUrl("")
    setRepository(null)
    setLanguages({})
    setContributors([])
    setReadme("")
    setAnalysis(null)
    setAiSummary("")
    setCodeHealth(null)
    setCodeHealthLoading(false)
    setCodeHealthError(null)
    setError("")
  }

  const handleRetryCodeHealth = () => {
    if (repository) {
      const parts = repository.full_name.split("/");
      if (parts.length === 2) {
        generateCodeHealth(parts[0], parts[1], repository.default_branch);
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0b0e14]">
      
      <Navbar activeTab="Docs" />


      <div className="flex-1 flex flex-col">
        {!repository ? (
          
          <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-3xl mx-auto space-y-8 my-auto">
              <LogoSection />

              <RepoUrlForm
                url={url}
                loading={loading}
                error={error}
                onChange={(value) => {
                  setUrl(value)
                  if (!value.trim()) {
                    handleResetAnalysis()
                  }
                }}
                onSubmit={handleSubmit}
              />

              <RecentAnalysis onSelectRepo={handleSelectRecentRepo} />
            </div>
          </main>
        ) : (
          /* Dashboard Analysis State with Left Sidebar (Image 2) */
          <div className="flex-1 flex flex-col lg:flex-row">
            <Sidebar
              activeTab={sidebarTab}
              onSelectTab={setSidebarTab}
              onNewAnalysis={handleResetAnalysis}
            />

            <main className="flex-1 p-6 sm:p-8 bg-[#0b0e14] overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                <RepositoryCard
                  repository={repository}
                  languages={languages}
                  contributors={contributors}
                  readme={readme}
                  analysis={analysis}
                  aiSummary={aiSummary}
                  aiLoading={aiLoading}
                  onGenerateAiSummary={handleGenerateSummary}
                  activeTab={sidebarTab}
                  onSelectTab={setSidebarTab}
                  codeHealth={codeHealth}
                  codeHealthLoading={codeHealthLoading}
                  codeHealthError={codeHealthError}
                  onRetryCodeHealth={handleRetryCodeHealth}
                />
              </div>
            </main>
          </div>
        )}
      </div>

    </div>
  )
}